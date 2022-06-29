// @ts-nocheck
import fs, { read } from 'fs';
import * as Sentry from "@sentry/node";
import { createOctokit, owner, repo } from './octokit';
import { escapeRegExp, repoNameFromUrl } from './lib/helpers';

const branch = process.env['GITHUB_REF_NAME']
const readmeInfoPath = `./AUTOGRADING.md`;
const mainBadgeString = `\n[![Status overview badge](../../blob/badges/.github/badges/${branch}/badge.svg)](#results)\n`;

async function modifyReadme(results, packageJson) {
  const octokit = createOctokit()
  if (!octokit) return

  let sha, content, path, readme = '';

  try {
    // get readme
    ({ data: { sha, content, path} } = await octokit.rest.repos.getReadme({
      owner,
      repo,
      ref: process.env['GITHUB_REF_NAME'],
    }));

    readme = Buffer.from(content, 'base64').toString('utf8');
  } catch (error) {
    Sentry.captureException(error);
  }

  try {
    // add main badge
    let newReadme = addMainBadge(readme);

    // add autograding info
    newReadme = await addAutogradingInfo(newReadme, results, packageJson)

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
    Sentry.captureException(error);
    console.log(error)
  }
}

function addMainBadge(readme) {
  const headlineLevel1Regex = /^#[^#].*$/m;
  // delete old points badge
  const newReadme = readme.replaceAll(/[\n]{0,1}.*\[\!\[Status overview badge\]\(.*[\n]/g, '')

  if(process.env.DISABLE_AUTOGRADING) return newReadme

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

// shorter alternative CodeBuddy notice for students:
// Check below for what you have achieved and for hints on what to improve. ⌛ If you see the orange dot ![processing](https://raw.githubusercontent.com/DCI-EdTech/autograding-setup/main/assets/processing.svg) on top, CodeBuddy is still processing.

async function addAutogradingInfo(fullReadme, results, packageJson) {
  const repoURL = `${process.env['GITHUB_SERVER_URL']}/${owner}/${repo}`
  const exerciseTemplateName = packageJson.repository ? repoNameFromUrl(packageJson.repository.url) : ''
  const readmeInfo = `## ![CodeBuddy](https://github.com/DCI-EdTech/autograding-setup/raw/main/assets/logo-large.svg) Results
> ⌛ Give it a minute. As long as you see the orange dot ![processing](https://raw.githubusercontent.com/DCI-EdTech/autograding-setup/main/assets/processing.svg) on top, CodeBuddy is still processing. Refresh this page to see it's current status.
>
> This is what CodeBuddy found when running your code. It is to show you what you have achieved and to give you hints on how to complete the exercise.

${generateResult(results)}

[🔬 Results Details](../../actions)
[🐞 Tips on Debugging](https://github.com/DCI-EdTech/autograding-setup/wiki/How-to-work-with-CodeBuddy)
[📢 Report Problem](https://docs.google.com/forms/d/e/1FAIpQLSfS8wPh6bCMTLF2wmjiE5_UhPiOEnubEwwPLN_M8zTCjx5qbg/viewform?usp=pp_url&entry.652569746=${encodeURIComponent(exerciseTemplateName)})
`

  const infoDelimiters = ['[//]: # (autograding info start)', '[//]: # (autograding info end)'];
  const setupDelimiters = ['[//]: # (autograding setup start)', '[//]: # (autograding setup end)'];
  const infoRE = new RegExp(`[\n]*${escapeRegExp(infoDelimiters[0])}([\\s\\S]*)${escapeRegExp(infoDelimiters[1])}`, 'gsm');
  const setupRE = new RegExp(`[\n]*${escapeRegExp(setupDelimiters[0])}([\\s\\S]*)${escapeRegExp(setupDelimiters[1])}`, 'gsm');

  // remove old info
  fullReadme = fullReadme.replace(infoRE, '')
  fullReadme = fullReadme.replace(setupRE, '').trim()

  if(process.env.DISABLE_AUTOGRADING) return fullReadme

  return `${fullReadme}\n\n${infoDelimiters[0]}\n${readmeInfo}\n\n${infoDelimiters[1]}`;
}

export default modifyReadme;