// @ts-nocheck
import svg from 'svg-builder'
import { groupBy } from 'lodash/fp'

export default function badge(results) {
  const lineHeight = 25
  let lines = 0
  const draw = svg.newInstance()

  let testResults = results.testResults.reduce((acc, item) => {
    acc.push(...item.assertionResults)
    return acc
  }, [])

  console.log("FLAT ARRAY", testResults)

  testResults = groupBy(testResults, item => item.ancestorTitles[0])

  console.log("RESULTS", testResults)

  /*results.testResults.forEach(test => {
    lines++

    draw
    .text({
      x: 1,
      y: lineHeight * lines,
      'font-family': 'helvetica',
      'font-size': 15,
      fill: '#fff',
    }, test.assertionResults[0].ancestorTitles[0]);

    test.assertionResults.forEach(result => {
      lines++

      draw
      .text({
        x: 4,
        y: lineHeight * lines,
        'font-family': 'helvetica',
        'font-size': 15,
        fill: '#fff',
      }, (result.status === 'passed' ? '✅' : '❌') + ' ' + result.title);
    })
  })
  
  draw
  .width(450)
  .height(lines * lineHeight + 10)
  
  return draw.render()*/
}