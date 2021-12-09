// @ts-nocheck

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
    const { data: { pushed_at, created_at} } = await octokit.rest.repos.get({
      owner,
      repo
    })

    const age = new Date(pushed_at) - new Date(created_at)

    // Only modify repo if repo or branch created
    const event = process.env['GITHUB_EVENT_NAME']
    if (event === 'create' || age < 25000) {
      //TODO: modify readme and package.json
      console.log('inject')
      await modifyReadme()

      if(event === 'create')
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
