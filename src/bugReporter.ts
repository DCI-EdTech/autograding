// @ts-nocheck
import { createOctokit, owner, repo } from './octokit'
import { removeTerminalColoring } from './lib/helpers'

export default async function reportBug(error) {
  // report bugs only for DCI Org for now
  // TODO: report also when running on student repos
  if(!process.env.IS_ORIGINAL_TEMPLATE_REPO) return

  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  const currentBranch = process.env['GITHUB_REF_NAME']

  const message = removeTerminalColoring(error.message)

  // check if issue already reported
  const {data:issues} = await octokit.rest.issues.listForRepo({
    owner,
    repo,
  });
r
  if(issues.find(issue => removeTerminalColoring(issue.body) === message)) return

  // get last commit of branch
  try {
    const {data} = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: currentBranch,
    })

    const author = data.find(item => !item.author.login.includes('[bot]')).author.login

    // create issue, label:bug, assign committer
    await octokit.rest.issues.create({
      owner,
      repo,
      title: `Autograding Runtime Error in \`${currentBranch}\``,
      body: message,
      labels: ['bug'],
      assignees: [author]
    });

    // TODO: make sure no duplicates are created

  } catch (err) {
    console.log(err)
  }

}