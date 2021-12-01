// @ts-nocheck
import fs from 'fs';
const path = require('path');

export default function(testsDir:string, packageJsonPath:string) {
  // read test folder contents  
  // if testsDir does not exist, look in src folder
  if (!fs.existsSync(testsDir)) {
    testsDir = path.join('src', testsDir);
  }
  const testFiles = fs.readdirSync(testsDir);
  const packageJson = fs.readFileSync(packageJsonPath)
  ;

  // filer autograding test files
  const autogradingTestFiles = testFiles.reduce((acc, file:string) => {
    const taskName = path.basename(file).match(/^tasks\.(.*)\.js$/)[1];
    if(taskName) acc.push({taskName, file});
    return acc;
  }, []);
  
  const autogradingTests = autogradingTestFiles.map((item, i, list) => {
    const pointsPerTask = Math.round(100/list.length)
    const additionalSetup = packageJson.autograding && packageJson.autograding.setup
    const testOpts = packageJson.autograding && packageJson.autograding.testOpts
    return {
      "name": `Task ${item.taskName}`,
      "setup": `npm install --ignore-scripts${additionalSetup ? ' && ' + additionalSetup : ''}`,
      "run": `CI=true npm test "(src\/)?__tests__\/tasks\.(.*)\.js"${testOpts ? ' ' + testOpts : ''} --json`,
      "timeout": 10,
      "points": i === list.length-1 ? 100 - pointsPerTask * (list.length-1) : pointsPerTask
    }
  })
  return autogradingTests
}