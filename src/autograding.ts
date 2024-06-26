// @ts-nocheck

import * as core from '@actions/core'
import path from 'path'
import * as Sentry from '@sentry/node'
import {RewriteFrames} from '@sentry/integrations'
import {runAll} from './runner'
import {owner} from './octokit'
import {sentryDSN} from './.secrets'

Sentry.init({
  dsn: sentryDSN,
  tracesSampleRate: 1.0,
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
})

const run = async (): Promise<void> => {
  try {
    const cwd = process.env['GITHUB_WORKSPACE']
    if (!cwd) {
      throw new Error('No GITHUB_WORKSPACE')
    }

    // filter
    // disable autograding output for all branches but autograding and autograding-solution
    // enable for classes passed through action yaml input
    const branch = process.env['GITHUB_REF_NAME']


    // check if running on exercise collection org
    if(owner === 'DigitalCareerInstitute' || owner === 'DCI-Webdev' || owner === 'FBW-Demo-Org') {
      process.env.IS_ORIGINAL_TEMPLATE_REPO = true

      if( branch == 'main' ||
          branch == 'solution' ||
          branch == 'master' ||
          branch == 'autotranslate') {
            console.log('disable Autograding output')
            process.env.DISABLE_AUTOGRADING = true
          }
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
