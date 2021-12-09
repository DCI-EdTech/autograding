import * as core from '@actions/core'
import path from 'path'
import {Test, runAll} from './runner'
import generateTestsList from './generateTestsList'
import modifyReadme from './modifyReadme'
import { createOctokit, owner, repo } from './octokit';

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    const octokit = createOctokit()
    const { data } = await octokit.rest.repos.get({
      owner,
      repo
    })

    console.log('CREATED', data['created_at'])
    console.log('PUSHED', data['pushed_at'])

    // Only modify repo if repo or branch created
    const event = process.env['GITHUB_EVENT_NAME']
    if (event === 'create') {
      //TODO: modify readme and package.json
      console.log('inject')
      await modifyReadme()
      return // stop autograding from running
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
