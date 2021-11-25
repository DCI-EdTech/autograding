// @ts-nocheck
import svg from 'svg-builder'

export default function badge(text) {
  svg.width(text.length * 10)
  svg.height(22)
  return svg
    .rect(0, 0, text.length * 10, 20)
    .fill('#fff')
    .text({
        x: 2,
        y: 1,
        'font-family': 'helvetica',
        'font-size': 15,
        stroke : '#000',
        fill: '#f00',
    }, text).render();
}