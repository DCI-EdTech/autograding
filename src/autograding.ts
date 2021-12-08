import * as core from '@actions/core'
import path from 'path'
import {Test, runAll} from './runner'
import generateTestsList from './generateTestsList'

const run = async (): Promise<void> => {
  //TODO: modify readme and package.json on first push or check for contents

  console.log('Running autograding', process.env)

  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    // make test request to see if we can confirm that it's from github ci
    

    const tests = generateTestsList('__tests__', path.resolve(cwd, 'package.json'))

    await runAll(tests as Array<Test>, cwd)
  } catch (error) {
    // If there is any error we'll fail the action with the error message
    let errorMessage = "Failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage)
    core.setFailed(`Autograding failure: ${error}`)
  }
}

// Don't auto-execute in the test environment
if (process.env['NODE_ENV'] !== 'test') {
  run()
}

export default run
