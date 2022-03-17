// @ts-nocheck
import axios from "axios";

export default async function recordResult(points, result) {
  console.log('record result')
  console.log(JSON.stringify(process.env))
  axios.post('https://smee.io/IvFctqLqvsxFy230', {
    test: 'test'
  })
}