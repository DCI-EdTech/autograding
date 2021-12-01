// @ts-nocheck
import svg from 'svg-builder'

export default function badge(results) {
  const draw = svg.newInstance()
  draw
  .width(200)
  .height(100)
  .text({
      x: 4,
      y: 25,
      'font-family': 'helvetica',
      'font-size': 15,
      fill: '#000',
  }, results[0].name + ' ✅ ❌');
  return draw.render()
}