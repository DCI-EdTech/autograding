// @ts-nocheck
import { SVG } from '@svgdotjs/svg.js'

function createBadge(points:any) {
  const svg = SVG('badge').size(300, 300)
  const text = svg.text(points).font({
    family: 'sans-serif',
    size: '200px',
    weight: 'bold'
  })
  const bbox = text.bbox()
  text.move(150 - bbox.width / 2, 150 - bbox.height / 2)
  return svg.svg()
}

export default createBadge