// @ts-nocheck
import * as core from '@actions/core'
import * as github from '@actions/github'
import createBadge from './badge'

export const setCheckRunOutput = async (points:number, availablePoints:number, results:Array): Promise<void> => {
  // If we have nothing to output, then bail
  if (typeof points === undefined) return

  // Our action will need to API access the repository so we require a token
  // This will need to be set in the calling workflow, otherwise we'll exit
  const token = process.env['GITHUB_TOKEN'] || core.getInput('token')
  if (!token || token === '') return

  // Create the octokit client
  const octokit: github.GitHub = github.getOctokit(token)
  if (!octokit) return

  // The environment contains a variable for current repository. The repository
  // will be formatted as a name with owner (`nwo`); e.g., jeffrafter/example
  // We'll split this into two separate variables for later use
  const nwo = process.env['GITHUB_REPOSITORY'] || '/'
  const [owner, repo] = nwo.split('/')
  if (!owner) return
  if (!repo) return

  // We need the workflow run id
  const runId = parseInt(process.env['GITHUB_RUN_ID'] || '')
  if (Number.isNaN(runId)) return

  // Generate badge
  const badge = createBadge(results)
  /*`<svg width="200.6" height="40" viewBox="0 0 1003 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Points ${points}/${availablePoints}">
    <title>Points ${points}/${availablePoints}</title>
    <g>
      <rect fill="#2f496e" width="433" height="200"/>
      <rect fill="#2988bc" x="433" width="570" height="200"/>
    </g>
    <g aria-hidden="true" fill="#fff" text-anchor="start" font-family="Verdana,DejaVu Sans,sans-serif" font-size="110">
      <text x="60" y="148" textLength="333" fill="#000" opacity="0.1">Points</text>
      <text x="50" y="138" textLength="333">Points</text>
      <text x="488" y="148" textLength="470" fill="#000" opacity="0.1">${points}/${availablePoints}</text>
      <text x="478" y="138" textLength="470">${points}/${availablePoints}</text>
    </g>
    
  </svg>`*/

  // get last commit of main
  try {
    const {data:[{sha:lastCommitSHA}]} = await octokit.rest.repos.listCommits({
      owner,
      repo,
    });

    // create badges brach
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/badges`,
      sha: lastCommitSHA,
    });
  } catch (error) {
    // branch already exists
  }  

  // Get badge sha
  let sha;
  try {
    ({data:{sha}} = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: ".github/badges/badge.svg",
      ref: "badges"
    }));
  } catch (error) {
    // branch doesn't exist yet
  }

  // upload badge to repository
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: '.github/badges/badge.svg',
    message: 'Update badge',
    content: Buffer.from(badge).toString('base64'), //badge,
    sha: sha || '',
    branch: 'badges',
  })

  // Fetch the workflow run
  const workflowRunResponse = await octokit.rest.actions.getWorkflowRun({
    owner,
    repo,
    run_id: runId,
  })

  // Find the check suite run
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkSuiteUrl = (workflowRunResponse.data as any).check_suite_url
  const checkSuiteId = parseInt(checkSuiteUrl.match(/[0-9]+$/)[0], 10)
  const checkRunsResponse = await octokit.rest.checks.listForSuite({
    owner,
    repo,
    check_name: 'Autograding',
    check_suite_id: checkSuiteId,
  })
  const checkRun = checkRunsResponse.data.total_count === 1 && checkRunsResponse.data.check_runs[0]
  if (!checkRun) return

  // Update the checkrun, we'll assign the title, summary and text even though we expect
  // the title and summary to be overwritten by GitHub Actions (they are required in this call)
  // We'll also store the total in an annotation to future-proof
  await octokit.rest.checks.update({
    owner,
    repo,
    check_run_id: checkRun.id,
    output: {
      title: 'Autograding',
      summary: `Points ${points}/${availablePoints}`,
      text: `Points ${points}/${availablePoints}`,
      annotations: [
        {
          // Using the `.github` path is what GitHub Actions does
          path: '.github',
          start_line: 1,
          end_line: 1,
          annotation_level: 'notice',
          message: `Points ${points}/${availablePoints}`,
          title: 'Autograding complete',
        },
      ],
    },
  })
}
