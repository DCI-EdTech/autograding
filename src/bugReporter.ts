// @ts-nocheck
import { createOctokit, owner, repo } from './octokit'

export default async function reportBug(error) {
  // report bugs only for DCI Org for now
  if(owner !== 'DigitalCareerInstitute') return

  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  const currentBranch = process.env['GITHUB_REF_NAME']

  // check if isue already reported

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
      body: error.message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''),
      labels: ['bug'],
      assignees: ['galymax']
    });

    // TODO: make sure no duplicates are created

  } catch (err) {
    // branch doesn't exist
  }

}