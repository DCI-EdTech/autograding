// @ts-nocheck
import svg from 'svg-builder'
import { xmlSecure } from './lib/helpers'

export default function badge(results) {
  const lineHeight = 25
  let lines = 0
  const draw = svg.newInstance()

  let testResults = results.testResults.reduce((acc, item) => {
    acc.push(...item.assertionResults)
    return acc
  }, []).reduce((acc, item) => {
    let arr = acc.find(i => i[0].ancestorTitles[0] == item.ancestorTitles[0])
    if(arr) {
      arr.push(item)
    } else {
      arr = [item]
      acc.push(arr)
    }
    return acc
  }, [])

  testResults.forEach(tests => {
    lines++

    draw
    .text({
      x: 1,
      y: lineHeight * lines,
      'font-family': 'helvetica',
      'font-size': 15,
      fill: '#fff',
    }, xmlSecure(tests[0].ancestorTitles[0]));

    tests.forEach(result => {
      lines++

      draw
      .text({
        x: 4,
        y: lineHeight * lines,
        'font-family': 'helvetica',
        'font-size': 15,
        fill: '#fff',
      }, (result.status === 'passed' ? '✅' : '❌') + ' ' + xmlSecure(result.title));
    })
  })
  
  draw
  .width(450)
  .height(lines * lineHeight + 10)
  
  return draw.render()
}