// @ts-nocheck

import * as core from '@actions/core'
import path from 'path'
import {Test, runAll} from './runner'
import { createOctokit, owner, repo } from './octokit';

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    // filter
    // disable autograding for all branches but autograding and autograding-solution
    const branch = process.env['GITHUB_REF_NAME']
    if(branch !== 'autograding' && branch !== 'autograding-solution') {
      console.log('disable Autograding')
      process.env.DISABLE_AUTOGRADING = true
    }

    await runAll(cwd, path.resolve(cwd, 'package.json'))
    
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
