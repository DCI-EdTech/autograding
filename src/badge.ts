// @ts-nocheck
import svg from 'svg-builder'

export default function badge(results) {
  const lineHeight = 25
  let lines = 0
  const draw = svg.newInstance()

  results.testResults.forEach(test => {
    test.assertionResults.forEach(result => {
      lines++

      draw
      .text({
        x: 4,
        y: lineHeight * lines,
        'font-family': 'helvetica',
        'font-size': 15,
        fill: '#fff',
      }, result.title + (result.status === 'passed' ? ' ✅' : ' ❌'));
    })
  })
  
  draw
  .width(450)
  .height(lines * lineHeight + 10)
  
  return draw.render()
}