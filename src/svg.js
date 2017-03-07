import { normalizeKeys } from './keys';

/**
 * Convenience/util function to create SVG elements.
 */
export function createElement(name, attrs) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  if (attrs && typeof attrs === 'object') {
    attrs = normalizeKeys(attrs, 'css');
    const keys = Object.keys(attrs);
    for (let i = 0; i < keys.length; i++) {
      node.setAttribute(keys[i], attrs[keys[i]]);
    }
  }
  return node;
}

/**
 * Create a rect for background color and borders. Width and height will be
 * added later once text width and height are known.
 */
export function createRect(options) {
  const rectOptions = normalizeKeys(options.rect, 'css');
  if (!rectOptions.hasOwnProperty('fill')) {
    // If `fill` is not specified, make invisible not black.
    rectOptions['fill-opacity'] = 0;
  }
  const rect = createElement('rect', rectOptions);
  if (options.element) {
    options.element.appendChild(rect);
  }
  return rect;
}

/**
 * Create and append a `tspan`.
 */
export function appendTspan(text, str, x, y) {
  let tspan = createTspan(str, x, y);
  text.appendChild(tspan);
  return tspan;
}

/**
 * Create a new `tspan`.
 */
export function createTspan(str, x = 0, y = 0) {
  const tspan = createElement('tspan', { x, y });
  writeInnerHTML(tspan, str);
  return tspan;
}

/**
 * Because `innerHTML` does not work with SVG in older browsers.
 */
export function writeInnerHTML(svgEl, content) {
  svgEl.innerHTML = content;
  const tempEl = document.createElement('div');
  tempEl.innerHTML = `<svg>${content}</svg>`;
  Array.prototype.slice.call(svgEl.childNodes).forEach(el => {
    svgEl.removeChild(el);
  });
  Array.prototype.slice.call(tempEl.childNodes[0].childNodes).forEach(el => {
    svgEl.appendChild(el);
  });
  return svgEl;
}
