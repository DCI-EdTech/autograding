// @ts-nocheck
import fs from 'fs';
import { createOctokit, owner, repo } from './octokit';
import readmeInfo from './markdownTemplate';
import { escapeRegExp } from './lib/helpers';

const readmeInfoPath = `./AUTOGRADING.md`;
const infoDelimiters = ['[//]: # (autograding info start)', '[//]: # (autograding info end)'];

async function modifyReadme() {
  const octokit = createOctokit()
  if (!octokit) return

  // get readme
  const { data: { sha, content} } = await octokit.rest.repos.getReadme({
    owner,
    repo,
    ref: process.env['GITHUB_REF_NAME'],
  })

  const readme = Buffer.from(content, 'base64').toString('utf8');

  console.log('README', readme)

  // add autograding info
  const newReadme = await addAutogradingInfo(readme)

  // update readme
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'README.md',
    message: 'update readme',
    content: Buffer.from(newReadme).toString('base64'),
    sha,
  })
}

async function addAutogradingInfo(readme) {
  const infoRE = new RegExp(`[\n\r]*${escapeRegExp(infoDelimiters[0])}([\\s\\S]*)${escapeRegExp(infoDelimiters[1])}`, 'gsm');

  // update results badge
  readmeInfo = readmeInfo.replace(/^\[\!\[Results badge\]\(.*$/gm, `[![Results badge](../../blob/badges/.github/badges/${process.env['GITHUB_REF_NAME']}/badge.svg)](#repoWebUrl/actions)`)

  // add repo link
  readmeInfo = readmeInfo.replace(/#repoWebUrl/g, `${process.env['GITHUB_SERVER_URL']}/${owner}/${repo}`);

  // remove old info
  readme = readme.replace(infoRE, '')
  return `${readme}\n\r${infoDelimiters[0]}\n${readmeInfo}\n\r${infoDelimiters[1]}`;
}

export default modifyReadme;