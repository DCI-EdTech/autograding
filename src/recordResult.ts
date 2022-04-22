// @ts-nocheck
import https from 'https'
import { createOctokit, owner, repo } from './octokit'
import { removeTerminalColoring } from './lib/helpers'

export default async function recordResult(points, result) {
  // get run info
  let runInfo, packageJson, commits
  try {
    const octokit: github.GitHub = createOctokit()
    if (!octokit) throw 'Octokit not initialized'

    const branch = process.env['GITHUB_REF_NAME']

    const { data } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: process.env.GITHUB_RUN_ID,
    });

    runInfo = data

    // get package.json (needs to be loaded through api again for sha)
    const { data: { sha, path, content } } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
      ref: branch,
    });

    packageJson = JSON.parse(Buffer.from(content, 'base64').toString('utf8'))

    // make sure template repo url is in package.json
    if(process.env.IS_ORIGINAL_TEMPLATE_REPO) {
      // set repository
      packageJson.repository = {
        "type": "git",
        "url": `https://github.com/${process.env.GITHUB_REPOSITORY}`,
        "id": runInfo ? runInfo.repository.id : ""
      }

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: 'add template repo info to package.json',
        content: Buffer.from(JSON.stringify(packageJson, null, 2)).toString('base64'),
        branch,
        sha,
      })
    }

    // don't record on first commit or when template
    const {data:repository} = await octokit.rest.repos.get({
      owner,
      repo,
    });

    ({data:commits} = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: branch,
    }))

    commits = commits.filter(commit => !(commit.author && commit.author.login.includes('[bot]')))

    // NOTE: doesn't record when students accept but don't submit anything
    // Another solution is needed to prevent recording when teachers create class template from main template
    if(commits.length < 1 || (commits.length && commits[0].author.login.includes('[bot]')) || process.env.IS_ORIGINAL_TEMPLATE_REPO || repository.is_template) return
  } catch (error) {
    console.log(error)
  }

  const payload = JSON.stringify({
    TIMESTAMP: runInfo && runInfo.run_started_at, // TIMESTAMP (format needs to change?)
    GITHUB_USER_NAME: runInfo && runInfo.actor.login, // VARCHAR
    GITHUB_USER_ID: runInfo && runInfo.actor.id, // MEDIUMINT
    GITHUB_USER_NODE_ID: runInfo && runInfo.actor.node_id, // VARCHAR
    GITHUB_USER_EMAIL: runInfo && runInfo.head_commit.author.email, // VARCHAR
    GITHUB_USER_AVATAR_URL: runInfo && runInfo.actor.avatar_url, // VARCHAR
    GITHUB_USER_HTML_URL: runInfo && runInfo.actor.html_url, // VARCHAR
    POINTS: points, // TINYINT
    TEST_HAS_RUNTIME_ERRORS: result.numRuntimeErrorTestSuites > 0, // BOOLEAN
    TEST_RUNTIME_ERRORS: result.runtimeError ? removeTerminalColoring(result.runtimeError.message).replace('●', '') : '', // TEXT
    INVOCATION_ID: process.env.INVOCATION_ID, // VARCHAR
    GITHUB_HEAD_BRANCH: runInfo && runInfo.head_branch, // VARCHAR
    GITHUB_HEAD_COMMIT_MESSAGE: runInfo && runInfo.head_commit.message, // VARCHAR
    GITHUB_REF: process.env.GITHUB_REF, // VARCHAR
    NUM_COMMITS: commits.length, // MEDIUMINT
    GITHUB_TEMPLATE_NAME: packageJson.repository && packageJson.repository.url.match(/([^\/]+$)/)[0], // VARCHAR
    GITHUB_TEMPLATE_REPOSITORY_URL: packageJson.repository && packageJson.repository.url, // VARCHAR
    GITHUB_TEMPLATE_REPOSITORY_ID: packageJson.repository && packageJson.repository.id, // INT
    GITHUB_SHA: process.env.GITHUB_SHA, // VARCHAR
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY, // VARCHAR
    GITHUB_REPOSITORY_HTML_URL: runInfo && runInfo.repository.html_url, // VARCHAR
    GITHUB_REPOSITORY_OWNER: process.env.GITHUB_REPOSITORY_OWNER, // VARCHAR
    GITHUB_RUN_ID: process.env.GITHUB_RUN_ID, // INT
    GITHUB_RUN_ATTEMPT: runInfo && runInfo.run_attempt, // SMALLINT
    GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER, // INT
    GITHUB_RUN_HTML_URL: runInfo && runInfo.html_url, // VARCHAR
    GITHUB_RETENTION_DAYS: process.env.GITHUB_RETENTION_DAYS, // SMALLINT
    GITHUB_WORKFLOW: process.env.GITHUB_WORKFLOW, // VARCHAR
    GITHUB_WORKFLOW_ID: runInfo && runInfo.workflow_id, // INT
    GITHUB_EVENT_NAME: process.env.GITHUB_EVENT_NAME, // VARCHAR
    GITHUB_SERVER_URL: process.env.GITHUB_SERVER_URL, // VARCHAR
    GITHUB_API_URL: process.env.GITHUB_API_URL, // VARCHAR
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME, // VARCHAR
    GITHUB_REF_PROTECTED: process.env.GITHUB_REF_PROTECTED, // BOOLEAN
    GITHUB_REF_TYPE: process.env.GITHUB_REF_TYPE, // VARCHAR
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE, // VARCHAR
    GITHUB_ACTION: process.env.GITHUB_ACTION, // VARCHAR
    GITHUB_ACTION_REPOSITORY: process.env.GITHUB_ACTION_REPOSITORY, // VARCHAR
    GITHUB_ACTION_REF: process.env.GITHUB_ACTION_REF, // VARCHAR
    GITHUB_ACTION_PATH: process.env.GITHUB_ACTION_PATH, // VARCHAR
    RUNNER_OS: process.env.RUNNER_OS, // VARCHAR
    RUNNER_ARCH: process.env.RUNNER_ARCH, // VARCHAR
    RUNNER_WORKSPACE: process.env.RUNNER_WORKSPACE, // VARCHAR
    TEST_RESULTS: result.testResults, // JSON
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