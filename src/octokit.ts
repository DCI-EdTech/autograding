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

  // add commit method
  async function commit(files, branch, message) {
    console.log(`Committing ${files.length} files with message: ${message}`)
    
    try {
      // create blobs
      const blobs = await Promise.all(files.map(async (file) => {
        await octokit.rest.git.createBlob({
          owner,
          repo,
          content: file.content,
          encoding: 'utf-8'
        })
      }))

      // create tree
      const tree = await octokit.git.createTree({
        owner,
        repo,
        tree: files.map((file, index) => {
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobs[index].data.sha
          }
        })
      })

      // create commit
      const commit = await octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: tree.data.sha,
        author: {
          name: 'github-actions',
          email: 'action@github.com'
        },
      })

      // update head
      await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commit.data.sha
      })
    } catch (error) {
      console.log(error)
    }
  }

  octokit.commit = commit

  return octokit
}

export { createOctokit, owner, repo }