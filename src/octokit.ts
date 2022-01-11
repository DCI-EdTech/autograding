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
      // get last commit of branch
      const {data:[{sha:lastCommitSHA, commit: {tree: {sha: lastCommitTreeSHA}}}], data} = await octokit.rest.repos.listCommits({
        owner,
        repo,
        ref: branch,
      })

      // create blobs
      const blobs = await Promise.all(files.map(async (file) => {
        return await octokit.rest.git.createBlob({
          owner,
          repo,
          content: file.content,
          encoding: 'utf-8'
        })
      }))

      // create tree
      const tree = await octokit.rest.git.createTree({
        owner,
        repo,
        tree: files.map((file, index) => {
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobs[index].data.sha
          }
        }),
        base_tree: lastCommitTreeSHA
      })

      console.log(`Created tree`)
      console.log(JSON.stringify(tree))

      // create commit
      const commit = await octokit.rest.git.createCommit({
        owner,
        repo,
        message,
        tree: tree.data.sha,
        parents: [lastCommitSHA],
        author: {
          name: 'github-actions',
          email: 'action@github.com'
        },
      })

      console.log(`Created commit ${commit.data.sha}`)

      // update head
      await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commit.data.sha,
        force: true
      })

      console.log(`Updated ref`)
    } catch (error) {
      console.log(error)
    }
  }

  octokit.commit = commit

  return octokit
}

export { createOctokit, owner, repo }