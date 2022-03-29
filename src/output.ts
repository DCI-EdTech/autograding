// @ts-nocheck
import { createOctokit, owner, repo } from './octokit'

export const setCheckRunOutput = async (points:number, availablePoints:number, results:Array): Promise<void> => {
  // If we have nothing to output, then bail
  if (typeof points === undefined) return

  // Create the octokit client
  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  const branch = process.env['GITHUB_REF_NAME']

  // We need the workflow run id
  const runId = parseInt(process.env['GITHUB_RUN_ID'] || '')
  if (Number.isNaN(runId)) return

  // update workflow file
  const { data: { sha, path, content:currentContent } } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: '.github/workflows/autograding.yml',
    ref: branch,
  });

  // get workflow template
  const { data: { content } } = await octokit.rest.repos.getContent({
    owner: 'DCI-EdTech',
    repo: 'autograding-setup',
    path: 'template/.github/workflows/autograding.yml',
    ref: 'main',
  });

  if(currentContent !== content) {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: 'update workflow',
      content,
      branch,
      sha,
    })
  }
  

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
  const res = await octokit.rest.checks.update({
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
