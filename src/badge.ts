// @ts-nocheck
import svg from 'svg-builder'
import { xmlSecure } from './lib/helpers'

export default function badge(testResults) {
  const lineHeight = 25
  let lines = 0
  const draw = svg.newInstance()

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