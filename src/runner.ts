// @ts-nocheck
import {spawn, ChildProcess} from 'child_process'
import kill from 'tree-kill'
import {v4 as uuidv4} from 'uuid'
import * as core from '@actions/core'
import {setCheckRunOutput} from './output'
import * as os from 'os'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import modifyReadme from './modifyReadme'
import updateBadges from './updateBadges'
import reportBug from './bugReporter'
import recordResult from './recordResult'

const currentBranch = process.env['GITHUB_REF_NAME']
const color = new chalk.Instance({level: 1})
const taskNamePattern = 'task(s)?(\.(.*))?\.js'
let setupError = ''

export type TestComparison = 'exact' | 'included' | 'regex'

export interface Test {
  readonly name: string
  readonly setup: string
  readonly run: string
  readonly input?: string
  readonly output?: string
  readonly timeout: number
  readonly points?: number
}

export class TestError extends Error {
  constructor(message: string) {
    super(message)
    Error.captureStackTrace(this, TestError)
  }
}

export class TestTimeoutError extends TestError {
  constructor(message: string) {
    super(message)
    Error.captureStackTrace(this, TestTimeoutError)
  }
}

export class TestOutputError extends TestError {
  expected: string
  actual: string

  constructor(message: string, expected: string, actual: string) {
    super(`${message}\nExpected:\n${expected}\nActual:\n${actual}`)
    this.expected = expected
    this.actual = actual

    Error.captureStackTrace(this, TestOutputError)
  }
}

const log = (text: string): void => {
  process.stdout.write(text + os.EOL)
}

const normalizeLineEndings = (text: string): string => {
  return text.replace(/\r\n/gi, '\n').trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const indent = (text: any): string => {
  let str = '' + new String(text)
  str = str.replace(/\r\n/gim, '\n').replace(/\n/gim, '\n  ')
  return str
}

const waitForExit = async (child: ChildProcess, timeout: number): Promise<void> => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    let timedOut = false

    const exitTimeout = setTimeout(() => {
      timedOut = true
      reject(new TestTimeoutError(`Setup timed out in ${timeout} milliseconds`))
      kill(child.pid)
    }, timeout)

    child.once('exit', (code: number, signal: string) => {
      if (timedOut) return
      clearTimeout(exitTimeout)

      if (code === 0) {
        resolve(undefined)
      } else {
        reject(new TestError(`Error: Exit with code: ${code} and signal: ${signal}`))
      }
    })

    child.once('error', (error: Error) => {
      if (timedOut) return
      clearTimeout(exitTimeout)

      reject(error)
    })
  })
}

const runSetup = async (test: Test, cwd: string, timeout: number): Promise<void> => {
  if (!test.setup || test.setup === '') {
    return
  }

  const setup = spawn(test.setup, {
    cwd,
    shell: true,
    env: {
      PATH: process.env['PATH'],
      FORCE_COLOR: 'true',
    },
  })

  // Start with a single new line
  process.stdout.write(indent('\n'))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup.stdout.on('data', chunk => {
    process.stdout.write(indent(chunk))
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup.stderr.on('data', chunk => {
    process.stderr.write(indent(chunk))
    setupError += indent(chunk)
  })

  setup.once('exit', async (code) => {
    if(code === 0) return;

    await reportBug({ message: `\`\`\`\n${setupError}\n\`\`\``})
  })

  await waitForExit(setup, timeout)
}

const runCommand = async (test: Test, cwd: string, timeout: number): Promise<void> => {
  let output = ''

  try {
    const child = spawn(test.run, {
      cwd,
      shell: true,
      env: {
        PATH: process.env['PATH'],
        FORCE_COLOR: 'true',
      },
    })
  
    // Start with a single new line
    process.stdout.write(indent('\n'))
  
    child.stdout.on('data', chunk => {
      if(chunk.toString().includes('{') || chunk.toString().includes('}')) {
        output += chunk
      } else {
        process.stdout.write(indent(chunk))
      }
    })
  
    child.stderr.on('data', chunk => {
      process.stderr.write(indent(chunk))
    })
  
    await waitForExit(child, timeout)
    return JSON.parse(output)
  } catch (error) {
    error.result = JSON.parse(output)
    throw error
  }
}

export const run = async (test: Test, cwd: string): Promise<void> => {
  // Timeouts are in minutes, but need to be in ms
  let timeout = (test.timeout || 1) * 60 * 1000 || 30000
  const start = process.hrtime()
  await runSetup(test, cwd, timeout)
  const elapsed = process.hrtime(start)
  // Subtract the elapsed seconds (0) and nanoseconds (1) to find the remaining timeout
  timeout -= Math.floor(elapsed[0] * 1000 + elapsed[1] / 1000000)
  let result
  try {
    result = await runCommand(test, cwd, timeout)
    return result
  } catch (error) {
    throw error
  }
}

export const runAll = async (cwd: string, packageJsonPath: string): Promise<void> => {
  let points = 0
  let availablePoints = 100
  let result
  let packageJson = fs.readFileSync(packageJsonPath);
  packageJson = Buffer.from(packageJson, 'base64').toString('utf8')
  try {
    packageJson = JSON.parse(packageJson);
  } catch (error) {
    console.log('Error: faulty package.json')
  }
  
  
  
  const additionalSetup = packageJson.autograding && packageJson.autograding.setup
  const testOpts = packageJson.autograding && packageJson.autograding.testOpts
  const test = {
    "name": `Tests`,
    "setup": `npm install --ignore-scripts${additionalSetup ? ' && ' + additionalSetup : ''}`,
    "run": `CI=true npm test -- "(src\/)?__tests__\/${taskNamePattern}"${testOpts ? ' ' + testOpts : ''} --json --silent`,
    "timeout": 10
  }

  // https://help.github.com/en/actions/reference/development-tools-for-github-actions#stop-and-start-log-commands-stop-commands
  const token = uuidv4()
  log('')
  log(`::stop-commands::${token}`)
  log('')

  let failed = false

  
  try {
    log(color.cyan(`📝 ${test.name}`))
    log('')
    result = await run(test, cwd)
    log('')
    log(color.green(`✅ ${test.name}`))
    log(``)
  } catch (error) {
    failed = true
    log('')
    log(color.red(`❌ ${test.name}`))
    result = error.result
    core.setFailed(error.message)
  }

  // Report bug as issue
  if(result.numRuntimeErrorTestSuites > 0) {
    await reportBug(result.testResults[0])
    result.runtimeError = result.testResults[0]
  }

  // sort results by filename
  result.testResults.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  })
  
  // group results
  result.testResults = result.testResults.reduce((acc, item) => {
    acc.push(...item.assertionResults)
    return acc
  }, []).reduce((acc, item, index) => {
    item.statusBadgePath = `.github/badges/${currentBranch}/status${index}.svg`
    let arr = acc.find(i => i[0].ancestorTitles[0] == item.ancestorTitles[0])
    if(arr) {
      arr.push(item)
    } else {
      arr = [item]
      acc.push(arr)
    }
    return acc
  }, [])

  // calculate tasks
  result.tasks = {
    total: result.testResults.length,
    completed: result.testResults.filter(testResult => {
      return !testResult.find(result => result.status !== 'passed')
    }).length
  }

  points = Math.round(result.testResults.reduce((acc, item) => {
    const pointsPerTest = 100 / result.tasks.total / item.length
    return acc + item.reduce((accc, result) => {
      return accc + (result.status === 'passed' ? pointsPerTest : 0)
    }, 0)
  }, 0))
  
  // Restart command processing
  log('')
  log(`::${token}::`)

  if (failed) {
    // We need a good failure experience
  } else {
    log('')
    log(color.green('All tests passed'))
    log('')
    log('✨🌟💖💎🦄💎💖🌟✨🌟💖💎🦄💎💖🌟✨')
    log('')
  }

  // Set the number of points
  const text = `Tasks ${result.tasks.completed}/${result.tasks.total}`
  log(color.bold.bgCyan.black(text))
  await Promise.all([modifyReadme(result), updateBadges(result)])
  await recordResult(points, result)
  core.setOutput('Points', `${points}/${availablePoints}`)
  await setCheckRunOutput(points, availablePoints, result)
}
