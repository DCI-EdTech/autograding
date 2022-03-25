// @ts-nocheck
import fs from 'fs';
import { createOctokit, owner, repo } from './octokit';
import { escapeRegExp } from './lib/helpers';

const branch = process.env['GITHUB_REF_NAME']
const readmeInfoPath = `./AUTOGRADING.md`;
const mainBadgeString = `\n[![Status overview badge](../../blob/badges/.github/badges/${branch}/badge.svg)](#results)\n`;

async function modifyReadme(results) {
  const octokit = createOctokit()
  if (!octokit) return

  try {
    // get readme
    const { data: { sha, content, path} } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      ref: process.env['GITHUB_REF_NAME'],
    });

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
      path,
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

function addMainBadge(readmePram) {
  const headlineLevel1Regex = /^#[^#].*$/m;
  // delete old points badge
  const newReadme = readmePram.replace(/[\n]{0,1}.*\[\!\[Status overview badge\]\(.*[\n]/gsm, '')

  console.log('lvl 1 headline found', headlineLevel1Regex.test(newReadme))
  console.log(newReadme)

  // check if there is a headline
  if(headlineLevel1Regex.test(newReadme)) {
    // insert points badge after level 1 headline
    return newReadme.replace(headlineLevel1Regex, `$&${mainBadgeString}`);
  } else {
    // insert badge on top if no headline found
    return `${mainBadgeString}${newReadme}`
  }

}

function generateResult(results) {
  return `${results.testResults.reduce((acc, testResult) => {
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

[🔬 Results Details](${repoURL}/actions)

[📢 Give Feedback or Report Problem](https://docs.google.com/forms/d/e/1FAIpQLSfS8wPh6bCMTLF2wmjiE5_UhPiOEnubEwwPLN_M8zTCjx5qbg/viewform?usp=pp_url&entry.652569746=${encodeURIComponent(process.env.GITHUB_REPOSITORY.split('/')[1])}&entry.2115011968=${encodeURIComponent('https://github.com/')}${encodeURIComponent(process.env.GITHUB_REPOSITORY)})

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
  return `${fullReadme}\n\n${infoDelimiters[0]}\n${readmeInfo}\n\n${infoDelimiters[1]}`;
}

export default modifyReadme;