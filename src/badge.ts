// @ts-nocheck
import svg from 'svg-builder'

export default function badge(text) {
  return svg
    .width(200)
    .height(100)
    .text({
        x: 4,
        y: 25,
        'font-family': 'helvetica',
        'font-size': 15,
        fill: '#000',
    }, text + ' ✅').render();
}