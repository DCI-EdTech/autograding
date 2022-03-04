// @ts-nocheck
import fs from 'fs';
import { createOctokit, owner, repo } from './octokit';
import { escapeRegExp } from './lib/helpers';

const branch = process.env['GITHUB_REF_NAME']
const readmeInfoPath = `./AUTOGRADING.md`;
const mainBadgeString = `\n[![Status overview badge](../../blob/badges/.github/badges/${branch}/badge.svg)](#results)\n`;
const mainBadgeRegExp =  /[\n]{0,1}.*\!\[Status overview badge\]\(.*[\n]/g

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

    // add main badge
    let newReadme = addMainBadge(readme);

    // add autograding info
    newReadme = await addAutogradingInfo(newReadme, results)

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

function addMainBadge(readme) {
  const headlineLevel1Regex = /^#[^#].*$/m;
  // delete old points badge
  readme = readme.replace(mainBadgeRegExp, '')

  // check if there is a headline
  if(readme.test(headlineLevel1Regex)) {
    // insert points badge after level 1 headline
    return readme.replace(headlineLevel1Regex, `$&${mainBadgeString}`);
  } else {
    // insert badge on top if no headline found
    return `${mainBadgeString}${readme}`
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
    return `| ![Status](../../blob/badges/${result.statusBadgePath}) | ${result.title} |\n`
  });
  return acc.concat(...lines);
}, '')}
`
}

async function addAutogradingInfo(fullReadme, results) {
  const repoURL = `${process.env['GITHUB_SERVER_URL']}/${owner}/${repo}`
  const readmeInfo = `## Results

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
  const infoRE = new RegExp(`[\n]*${escapeRegExp(infoDelimiters[0])}([\\s\\S]*)${escapeRegExp(infoDelimiters[1])}`, 'gsm');

  // remove old info
  fullReadme = fullReadme.replace(infoRE, '').trim()
  return `${fullReadme}\n${infoDelimiters[0]}\n${readmeInfo}\n\n${infoDelimiters[1]}`;
}

export default modifyReadme;