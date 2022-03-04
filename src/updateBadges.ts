// @ts-nocheck
import { createOctokit } from './octokit'
import createBadge from './badge'
import { successIcon, failureIcon } from './statusIcons'

export default async function updateBadges(results:Array<any>): Promise<void> {
  const octokit: github.GitHub = createOctokit()
  if (!octokit) return

  const currentBranch = process.env['GITHUB_REF_NAME']

  const badgePath = `.github/badges/${currentBranch}/badge.svg`

  // generate status badges
  const badges = results.testResults.reduce((acc, testResult) => {
    const statusBadges = testResult.map((result, index) => {
      return {path: result.statusBadgePath, content: result.status === 'passed' ? successIcon : failureIcon}
    });
    acc.push(...statusBadges);
    return acc;
  }, [])

  // add main badge
  badges.push({path: badgePath, content: createBadge(results.testResults)})

  // update status badges
  await octokit.commit(badges, 'badges', 'Update badges')
}