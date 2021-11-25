// returns a window with a document and an svg root node
// @ts-nocheck
import { createSVGWindow } from 'svgdom'
import { SVG, registerWindow } from '@svgdotjs/svg.js'

export default function createBadge(text) {
  const window = createSVGWindow()
  const document = window.document
  const svg = new SVG(document.body).size(100, 100)
  const root = svg.group()
  const textNode = root.text(text).font({
    family: 'sans-serif',
    size: '24px',
    anchor: 'middle',
    leading: '1em',
  })
  const textBBox = textNode.bbox()
  const textWidth = textBBox.width
  const textHeight = textBBox.height
  const padding = 10
  const width = textWidth + padding * 2
  const height = textHeight + padding * 2
  const background = root.rect(width, height).fill('#fff')
  const foreground = root.rect(width, height).fill('#000')
  const badge = root.group().add(background).add(foreground).add(textNode)
  badge.move(0, 0)
  badge.transform({
    x: -width / 2,
    y: -height / 2,
  })
  return svg.svg()
}