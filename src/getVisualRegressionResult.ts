// @ts-nocheck
import fs from 'fs'
import path from 'path';
import { createOctokit } from './octokit'

export default async function getVisualReressionResult() {
    if(process.env.DISABLE_AUTOGRADING) return

    const octokit: github.GitHub = createOctokit()
    if (!octokit) return

    const dir = path.join(process.env.GITHUB_WORKSPACE, '__tests__', '__image_snapshots__', '__diff_output__')
    const images = []

    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const data = fs.readFileSync(path.join(dir, file), 'utf8')
        images.push({path: `.github/visual-regression-diffs/${file}`, content: data})
    });

    console.log('commit', images)

    await octokit.commit(images, 'badges', 'upload regression diffs', true)
}

