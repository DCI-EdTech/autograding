// @ts-nocheck
import fs from 'fs';
import { createOctokit, owner, repo } from './octokit';
import { escapeRegExp } from './lib/helpers';

const branch = process.env['GITHUB_REF_NAME']
const readmeInfoPath = `./AUTOGRADING.md`;

async function modifyReadme(results) {
  const octokit = createOctokit()
  if (!octokit) return

  try {
    // get readme
    const { data: { sha, content} } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'README.md',
      ref: process.env['GITHUB_REF_NAME'],
    })

    const readme = Buffer.from(content, 'base64').toString('utf8');

    // add autograding info
    const newReadme = await addAutogradingInfo(readme, results)

    // don't update if nothing changed
    if(newReadme === readme)
      return

    // update readme
    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'README.md',
      message: 'update readme',
      content: Buffer.from(newReadme).toString('base64'),
      branch: process.env['GITHUB_REF_NAME'],
      sha,
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}

function generateResult(results) {
  return `# Results

    ${results.testResults.reduce((acc, testResult) => {
      acc += `
      ### ${testResult[0].ancestorTitles[0]}

      |                 Status                  | Check                                                                                    |
      | :-------------------------------------: | :--------------------------------------------------------------------------------------- |
      `
      const lines = testResult.map((result) => {
        return `| ![Status](../../blob/badges/${result.statusBadgePath}) | ${result.title} |`
      });
      return acc.concat(...lines);
    }, '')}
  `
}

async function addAutogradingInfo(fullReadme, results) {
  const repoURL = `${process.env['GITHUB_SERVER_URL']}/${owner}/${repo}`
  const readmeInfo = `## Results
  [![Results badge](../../blob/badges/.github/badges/${branch}/badge.svg)](${repoURL}/actions)

  ${generateResult(results)}
  
  [Results Details](${repoURL}/actions)
  
  ### Debugging your code
  > [reading the test outputs](https://github.com/DCI-EdTech/autograding-setup/wiki/Reading-test-outputs)
  
  There are two ways to see why tasks might not be completed:
  #### 1. Running tests locally
  - Run \`npm install\`
  - Run \`npm test\` in the terminal. You will see where your solution differs from the expected result.
  
  #### 2. Inspecting the test output on GitHub
  - Go to the [Actions tab of your exercise repo](${repoURL}/actions)
  - You will see a list of the test runs. Click on the topmost one.
  - Click on 'Autograding'
  - Expand the item 'Run DCI-EdTech/autograding-action@main'
  - Here you see all outputs from the test run`

  const infoDelimiters = ['[//]: # (autograding info start)', '[//]: # (autograding info end)'];
  const infoRE = new RegExp(`[\n\r]*${escapeRegExp(infoDelimiters[0])}([\\s\\S]*)${escapeRegExp(infoDelimiters[1])}`, 'gsm');

  // remove old info
  fullReadme = fullReadme.replace(infoRE, '')
  return `${fullReadme}\n\r${infoDelimiters[0]}\n${readmeInfo}\n\r${infoDelimiters[1]}`;
}

export default modifyReadme;