// @ts-nocheck
import * as core from '@actions/core'
import * as github from '@actions/github'

let owner: string, repo: string

function createOctokit() {
  const token = process.env['GITHUB_TOKEN'] || core.getInput('token')
  if (!token || token === '') return

  // Create the octokit client
  const octokit: github.GitHub = github.getOctokit(token)
  if (!octokit) return

  // The environment contains a variable for current repository. The repository
  // will be formatted as a name with owner (`nwo`); e.g., jeffrafter/example
  // We'll split this into two separate variables for later use
  const nwo = process.env['GITHUB_REPOSITORY'] || '/';
  [owner, repo] = nwo.split('/')
  if (!owner) return
  if (!repo) return

  return octokit
}

export { createOctokit, owner, repo }