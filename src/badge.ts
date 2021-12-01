// @ts-nocheck
import svg from 'svg-builder'

export default function badge(results) {
  const lineHeight = 25
  let lines = 0
  const draw = svg.newInstance()
  draw
  .width(200)
  .height(results.testResults[0].assertionResults.length * lineHeight)

  results.testResults[0].assertionResults.forEach(result => {
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
  
  return draw.render()
}