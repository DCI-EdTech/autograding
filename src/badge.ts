// @ts-nocheck
import SvgText from 'svg-text';

export default function badge(text) {
  return new SvgText({
    text,
    maxWidth: 100,
    textOverflow: 'ellipsis',
  }).svg
}