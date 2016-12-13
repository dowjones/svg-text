/**
 * NOT USED!!! Complexity greater than value
 */

import rect from './rect';
import SvgText from './SvgText';
import * as svg from './svg';
import { normalizeKeys } from './keys';
import { isPosNum, toArrayLen4, updateSizeOptions, minNum } from './util';
import { writeStyle } from './style';
import merge from 'lodash.merge';
import isFinite from 'lodash.isfinite';


export default class SvgTextGroup {
  /**
   * @constructor
   * @param {object} options
   * @param {array} options.items
   * @param {SVGElement=} options.element to append the text into
   * @param {string=} options.id `id` attribute
   * @param {number=} options.x
   * @param {number=} options.y
   * @param {number=} options.width
   * @param {number=} options.height
   * @param {string=} options.selectorNamespace
   * @param {string=} options.className
   * @param {object=} options.style Styles to be written as CSS to a `style` element.
   * @param {object=} options.styleElement The `style` element to write styles to.
   * @param {array=} options.padding [top, right, bottom, left]
   * @param {array=} options.margin [top, right, bottom, left]
   * @param {object=} options.attrs Attributes applied to the `g` element
   * @param {object=} options.rect Attributes applied to an underlying `rect`
   * @param {string=} options.direction [up|down] Default is down (top to bottom).
   *   If 'up', then options.height must be set explictly.
   * @param {string=} rasterFont Default rasterFont for all child text elements.
   * @param {string=} aiFont Default aiFont for all child text elements.
   */
  constructor(options) {
    this.options = updateOptions(options);
    writeStyleAsCss(this.options);
    this.g = createG(this.options);
    this.rect = this.options.rect ? createRect(this.options, this.g) : null;
    this.text = createText(this.g, this.options);
    if (this.rect) {
      if (this.options.rect.width === 0) {
        this.rect.setAttribute('width', this.text.bounds.width +
          this.options.padding[3] + this.options.padding[1]);
      }
      if (this.options.rect.height === 0) {
        this.rect.setAttribute('height', this.text.bounds.height +
          this.options.padding[0] + this.options.padding[2]);
      } else {
        this.rect.setAttribute('height', this.options.height);
      }
    }
  }
}

function updateOptions(options) {
  options = updateSizeOptions(options);
  options.direction = (options.directions === 'up' && isPosNum(options.height)) ?
    'up' : 'down';
  return options;
}

// Write styles to apply to all `text` elements in this group.
function writeStyleAsCss(options) {
  if (options.style && options.styleElement) {
    const className = options.className ?
      ('text.' + options.className.split(' ')[0]) : null;
    if (className) {
      const namespace = options.selectorNamespace || '';
      const selector = [namespace, className].join(' ').replace(/^\s+|\s+$/g, '');
      if (selector) {
        writeStyle(selector, options.style, options.styleElement);
      }
    }
  }
}

// Create the container for all `text` elements in this group.
function createG(options) {
  const attrs = normalizeKeys(options.attrs, 'css');
  const g = svg.createElement('g', attrs);
  if (options.x !== 0 || options.y !== 0) {
    g.setAttribute('transform', [
      'translate(',
      options.x,
      ',',
      options.y,
      ')',
    ].join(''));
  }
  options.element.appendChild(g);
  return g;
}

// The background color is provided by an optional `rect` element.
function createRect(options, g) {
  options.rect.x -= options.x;
  options.rect.y -= options.y;
  return rect({
    rect: options.rect,
    element: g
  });
}

function createText(g, options) {
  let x = options.textPos.x - options.x;
  let y = (options.direction === 'up') ? options.textPos.height :
    options.textPos.y - options.y;
  let width = options.textPos.width;
  let height = 'auto';//options.textPos.height;
  let maxWidth = options.textPos.maxWidth;
  let maxHeight = options.textPos.maxHeight;
  let maxLines = options.maxLines;
  let bounds;

  const items = options.items.map(item => {
    const textOptions = merge({
      selectorNamespace: options.selectorNamespace,
      className: options.className,
      styleElement: options.styleElement,
      textOverflow: options.textOverflow,
      maxLines: maxLines,
    }, item, { element: g });
    textOptions.x = x + (isFinite(item.x) ? item.x : 0);
    textOptions.y = y + (isFinite(item.y) ? item.y : 0);
    textOptions.width = minNum(width, item.width);
    textOptions.height = minNum(height, item.height);
    textOptions.maxWidth = minNum(maxWidth, item.maxWidth);
    textOptions.maxHeight = minNum(maxHeight, item.maxHeight);
    textOptions.outerWidth = textOptions.width;
    textOptions.outerHeight = textOptions.height;

    const text = new SvgText(textOptions);
    y = text.bounds.y + ((options.direction === 'up') ? 0 : text.bounds.height);
    if (isPosNum(height)) {
      height = Math.max(0, height - text.bounds.height);
    }
    if (isPosNum(maxHeight)) {
      maxHeight = Math.max(0, maxHeight - text.bounds.height);
    }
    maxLines = Math.max(0, maxLines - text.lines);
    bounds = updateBounds(bounds, text.bounds);
    return text;
  });
  return { items, bounds };
}

// @param itemBounds are added to @param bounds.
export function updateBounds(bounds, itemBounds) {
  if (bounds === undefined) {
    return {
      x: itemBounds.x,
      y: itemBounds.y,
      width: itemBounds.width,
      height: itemBounds.height,
    };
  }
  const boundsX = Math.min(bounds.x, itemBounds.x);
  const boundsY = Math.min(bounds.y, itemBounds.y);
  bounds.width -= boundsX - bounds.x;
  bounds.height -= boundsY - bounds.y;
  bounds.x = boundsX;
  bounds.y = boundsY;
  const boundsX2 = bounds.x + bounds.width;
  const boundsY2 = bounds.y + bounds.height;
  const itemX2 = itemBounds.x + itemBounds.width;
  const itemY2 = itemBounds.y + itemBounds.height;
  bounds.width = Math.max(itemX2, boundsX2) - bounds.x;
  bounds.height = Math.max(itemY2, boundsY2) - bounds.y;
  return bounds;
}
