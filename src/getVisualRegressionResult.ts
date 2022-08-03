// @ts-nocheck
import fs from 'fs'
import path from 'path';

export default async function getVisualReressionResult() {
    console.log(process.env)
    const dir = path.join(process.env.GITHUB_WORKSPACE, '__tests__', '__image_snapshots__', '__diff_output__')
    fs.readdir(dir, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            fs.readFile(path.join(dir, file), 'utf8', (err, data) => {
                console.log(file, data)
            })
        });
    });
}

