// @ts-nocheck
import fs from 'fs'
import path from 'path';
import { createOctokit } from './octokit'

export default async function getVisualReressionResult() {
    if(process.env.DISABLE_AUTOGRADING) return

    const octokit: github.GitHub = createOctokit()
    if (!octokit) return

    const dir = path.join(process.env.GITHUB_WORKSPACE, '__tests__', '__image_snapshots__')
    const images = []

    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const data = fs.readFileSync(path.join(dir, file), 'binary')
            const buffer = Buffer.from(data, 'binary')
            const content = buffer.toString('base64')
            images.push({path: `.github/visual-regression-diffs/${file}`, content, encoding: 'base64'})
        });

        await octokit.commit(images, 'badges', 'upload regression diffs', true)
    } catch (error) {
        // no regression diff files exist or
        // unable to upload
        console.log(error)
    }
}

