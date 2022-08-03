// @ts-nocheck
import fs from 'fs'
import path from 'path';
import { createOctokit } from './octokit'

export default async function getVisualReressionResult() {
    if(process.env.DISABLE_AUTOGRADING) return

    const octokit: github.GitHub = createOctokit()
    if (!octokit) return

    const dir = path.join(process.env.GITHUB_WORKSPACE, '__tests__', '__image_snapshots__', '__diff_output__')
    const files = []
    fs.readdir(dir, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            fs.readFile(path.join(dir, file), 'utf8', (err, data) => {
                console.log(file, data)
                files.push({path: `.github/visual-regression-diffs/${file}`, content: data})
            })
        });
    });

    await octokit.commit(files, 'badges', 'upload regression diffs', true)
}

