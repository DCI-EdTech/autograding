// @ts-nocheck
import { createOctokit, owner, repo } from './octokit'
import createBadge from './badge'
import { successIcon, failureIcon } from './statusIcons'

export const setCheckRunOutput = async (points:number, availablePoints:number, results:Array): Promise<void> => {
  // If we have nothing to output, then bail
  if (typeof points === undefined) return

  // Create the octokit client
  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  // We need the workflow run id
  const runId = parseInt(process.env['GITHUB_RUN_ID'] || '')
  if (Number.isNaN(runId)) return

  const currentBranch = process.env['GITHUB_REF_NAME']

  // Generate badge
  const badge = createBadge(results.testResults)

  const badgePath = `.github/badges/${currentBranch}/badge.svg`

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
      path: badgePath,
      ref: "badges"
    }));
  } catch (error) {
    // branch doesn't exist yet
  }

  // upload badge to repository
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: badgePath,
    message: 'Update badge',
    content: Buffer.from(badge).toString('base64'), //badge,
    sha: sha || '',
    branch: 'badges',
  })

  // generate status badges
  const statusBadges = results.testResults.reduce((acc, testResult) => {
    const badges = testResult.map((result, index) => {
      return {path: `${currentBranch}/status${acc.length + index}.svg`, content: result.status === 'passed' ? successIcon : failureIcon}
    });
    acc.push(...badges);
    return acc;
  }, [])

  console.log('GENERATED', statusBadges)


  // update status badges
  await octokit.commit(statusBadges, 'badges', 'Update status badges')

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
