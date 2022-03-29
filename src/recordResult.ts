// @ts-nocheck
import https from 'https'
import { createOctokit, owner, repo } from './octokit'
import { removeTerminalColoring } from './lib/helpers'

export default async function recordResult(points, result) {
  // get run info
  let runInfo
  try {
    const octokit: github.GitHub = createOctokit()
    if (!octokit) throw 'Octokit not initialized'

    const { data } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: process.env.GITHUB_RUN_ID,
    });

    runInfo = data
  } catch (error) {
    console.log(error)
  }

  const payload = JSON.stringify({
    TIMESTAMP: runInfo && runInfo.run_started_at, // TIMESTAMP
    GITHUB_USER_NAME: runInfo && runInfo.actor.login, // VARCHAR
    GITHUB_USER_ID: runInfo && runInfo.actor.id, // 
    GITHUB_USER_NODE_ID: runInfo && runInfo.actor.node_id,
    GITHUB_USER_EMAIL: runInfo && runInfo.head_commit.author.email,
    GITHUB_USER_AVATAR_URL: runInfo && runInfo.actor.avatar_url,
    GITHUB_USER_HTML_URL: runInfo && runInfo.actor.html_url,
    POINTS: points,
    TEST_HAS_RUNTIME_ERRORS: result.numRuntimeErrorTestSuites > 0,
    TEST_RUNTIME_ERRORS: removeTerminalColoring(result.testResults[0].message),
    INVOCATION_ID: process.env.INVOCATION_ID,
    GITHUB_HEAD_BRANCH: runInfo && runInfo.head_branch,
    GITHUB_HEAD_COMMIT_MESSAGE: runInfo && runInfo.head_commit.message,
    GITHUB_REF: process.env.GITHUB_REF,
    GITHUB_SHA: process.env.GITHUB_SHA,
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
    GITHUB_REPOSITORY_HTML_URL: runInfo && runInfo.repository.html_url,
    GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER,
    GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
    GITHUB_RUN_ATTEMPT: runInfo && runInfo.run_attempt,
    GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER,
    GITHUB_RUN_HTML_URL: runInfo && runInfo.html_url,
    GITHUB_RETENTION_DAYS: process.env.GITHUB_RETENTION_DAYS,
    GITHUB_RUN_ATTEMPT: process.env.GITHUB_RUN_ATTEMPT,
    GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW,
    GITHUB_WORKFLOW_ID: runInfo && runInfo.workflow_id,
    GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME,
    GITHUB_SERVER_URL: process.env.GITHUB_SERVER_URL,
    GITHUB_API_URL: process.env.GITHUB_API_URL,
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME,
    GITHUB_REF_PROTECTED: process.env.GITHUB_REF_PROTECTED,
    GITHUB_REF_TYPE: process.env.GITHUB_REF_TYPE,
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE,
    GITHUB_ACTION: process.env.GITHUB_ACTION,
    GITHUB_ACTION_REPOSITORY: process.env.GITHUB_ACTION_REPOSITORY,
    GITHUB_ACTION_REF: process.env.GITHUB_ACTION_REF,
    GITHUB_ACTION_PATH: process.env.GITHUB_ACTION_PATH,
    RUNNER_OS: process.env.RUNNER_OS,
    RUNNER_ARCH: process.env.RUNNER_ARCH,
    RUNNER_WORKSPACE: process.env.RUNNER_WORKSPACE
  })

  // CONSIDERATION:
  // Should check results of individual task assertions be stored in separate table?

  // send webhook event
  try {
    const req = https.request({
      hostname: 'smee.io',
      port: 443,
      path: '/IvFctqLqvsxFy230',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    })
    
    req.on('error', error => {
      throw error
    })
    
    req.write(payload)
    req.end()
  } catch (error) {
    console.log(error)
  }
  
}