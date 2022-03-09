// @ts-nocheck
import { createOctokit, owner, repo } from './octokit'

function cleanMessage(message) {
  if(!message) return message
  return message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

export default async function reportBug(error) {
  // report bugs only for DCI Org for now
  // TODO: report also when running on student repos
  if(owner !== 'DigitalCareerInstitute') return

  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  const currentBranch = process.env['GITHUB_REF_NAME']

  const message = cleanMessage(error.message)

  // check if issue already reported
  const {data:issues} = await octokit.rest.issues.listForRepo({
    owner,
    repo,
  });

  if(issues.find(issue => cleanMessage(issue.body) === cleanMessage(error.message))) return

  // get last commit of branch
  try {
    const {data} = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: currentBranch,
    })
    const author = data.find(item => !item.commit.author.name.includes('[bot]')).commit.author.name

    // create issue, label:bug, assign committer
    await octokit.rest.issues.create({
      owner,
      repo,
      title: 'Autograding Runtime Error',
      body: message,
      labels: ['bug'],
      assignees: [author]
    });

    // TODO: make sure no duplicates are created

  } catch (err) {
    console.log(err)
  }

}