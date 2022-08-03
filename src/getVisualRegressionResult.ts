// @ts-nocheck
import fs from 'fs'

export default async function getVisualReressionResult() {
    console.log(process.env)
    fs.readdir(process.env.GITHUB_WORKSPACE, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            console.log(file); 
        });
    });
}

