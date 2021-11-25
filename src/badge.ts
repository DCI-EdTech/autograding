// @ts-nocheck
import svg from 'svg-builder'

export default function badge(text) {
  return svg
    .width(100)
    .height(100)
    .text({
        x: 50,
        y: 50,
        'font-family': 'helvetica',
        'font-size': 15,
        stroke : '#000',
        fill: '#f00',
    }, text).render();
}