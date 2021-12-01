// @ts-nocheck
import svg from 'svg-builder'

export default function badge(results) {
  const lineHeight = 25
  let lines = 0
  const draw = svg.newInstance()

  results.testResults.forEach(test => {
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
      }, (result.status === 'passed' ? ' ✅' : ' ❌') + result.title);
    })
  })
  
  draw
  .width(450)
  .height(lines * lineHeight + 10)
  .rect({
    x: 0,
    y: 0,
    width: 450,
    height: lines * lineHeight + 10,
    fill: '#000',
    rx: 5,
    ry: 5,
  })
  
  return draw.render()
}