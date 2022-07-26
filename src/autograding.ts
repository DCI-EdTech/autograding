// @ts-nocheck

import * as core from '@actions/core'
import path from 'path'
import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";
import {Test, runAll} from './runner'
import { owner } from './octokit';
import { sentryDSN } from './.secrets';

Sentry.init({
  dsn: sentryDSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    // filter
    // disable autograding output for all branches but autograding and autograding-solution
    const branch = process.env['GITHUB_REF_NAME']
    if( owner !== 'Autograding-Demo-Class' &&
        branch !== 'autograding' &&
        branch !== 'autograding-solution' &&
        branch !== 'codebuddy' &&
        branch !== 'codebuddy-solution') {
      console.log('disable Autograding output')
      process.env.DISABLE_AUTOGRADING = true
    }


    // check if running on exercise collection org
    if(owner === 'DigitalCareerInstitute') {
      process.env.IS_ORIGINAL_TEMPLATE_REPO = true
    }

    await runAll(cwd, path.resolve(cwd, 'package.json'))
    
  } catch (error) {
    // If there is any error we'll fail the action with the error message
    
    if(!process.env.DISABLE_AUTOGRADING) {
      // if output is disabled we also don't display fail to students

      let errorMessage = "Failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(errorMessage)
      core.setFailed(`Autograding failure: ${error}`)
    }
  }
}

// Don't auto-execute in the test environment
if (process.env['NODE_ENV'] !== 'test') {
  run()
}

export default run
