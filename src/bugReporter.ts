// @ts-nocheck
import { createOctokit, owner, repo } from './octokit'

export default async function reportBug(error) {
  // report bugs only for DCI Org for now
  if(owner !== 'DigitalCareerInstitute') return

  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  const currentBranch = process.env['GITHUB_REF_NAME']

  // get last commit of branch
  console.log('get commits of', owner, repo, currentBranch)
  try {
    const {data} = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: currentBranch,
    })
    console.log('commits', JSON.stringify(data))

    // create issue, label:bug, assign committer

    // TODO: make sure no duplicates are created

  } catch (err) {
    // branch doesn't exist
  }

}