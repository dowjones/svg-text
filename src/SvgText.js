import {
  createElement,
  createRect,
} from './svg';
import {
  isPosNum,
  updateSizeOptions,
} from './math';
import { normalizeKeys } from './keys';
import { writeStyle } from './style';
import render from './render';
import isFinite from 'lodash.isfinite';
import merge from 'lodash.merge';

let _svgEl = null;
let _styleEl = null;

export default class SvgText {
  /**
   * @construtor
   * @param {object} options
   * @param {SVGElement} options.element to append the text into
   * @param {string} options.text
   * @param {number=} options.x
   * @param {number=} options.y
   * @param {number=} options.width
   * @param {number=} options.height
   * @param {number=} options.maxWidth
   * @param {number=} options.maxHeight
   * @param {number=} options.maxLines
   * @param {string=} options.align [left|center|right] Default is left
   * @param {string=} options.verticalAlign [top|middle|bottom] Default is top
   * @param {string=} options.textOverflow [clip|ellipsis|custom] Default is clip
   * @param {string=} options.selectorNamespace
   * @param {string=} options.className
   * @param {object=} options.style Styles to be written as CSS to a `style` element.
   * @param {object=} options.styleElement The `style` element to write styles to.
   * @param {object=} options.attrs Attributes applied to the `text` element
   * @param {object=} options.rect Attributes applied to an underlying `rect`
   * @param {array=} options.padding [top, right, bottom, left]
   * @param {array=} options.margin [top, right, bottom, left]
   */
  constructor(options) {
    this.options = updateOptions(options);
    this.uid = this.options.uid;
    this.rect = this.options.rect ? createRect(this.options) : null;
    this.text = createText(this.options);
    writeStyleAsCss(this.options);

    const compStyle = window.getComputedStyle(this.text, null);
    this.fontSize = parseFloat(compStyle.getPropertyValue('font-size'));
    this.lineHeight = parseFloat(compStyle.getPropertyValue('line-height')) ||
      this.fontSize * 1.2;
    this.lines = render(this.text, this.options, this.lineHeight);
    this.bounds = sizeBounds(this.text, this.options);
    sizeRect(this.rect, this.bounds, this.options.rect);
    offsetByMargin(this.bounds, this.options.margin);

    moveText(this.text, this.options, {
      fontSize: this.fontSize,
      lineHeight: this.lineHeight,
      lines: this.lines
    });
  }

  /**
   * Transforms `text` into a form ready to be opened in Adobe Illustrator.
   * @param {SVG text element} textWeb SVG element prepared for the web.
   * @param {SVG text element} textAi Duplicate SVG element to be prepared for Illustrator.
   * @param {string} font The font as a name that Illustrator will recognize.
   */
  static forIllustrator(textWeb, textAi, font) {
    const compStyle = window.getComputedStyle(textWeb, null);
    if (font) {
      textAi.setAttribute('font-family', font);
    }
    textAi.setAttribute('font-size', compStyle.getPropertyValue('font-size'));
    textAi.setAttribute('line-height', compStyle.getPropertyValue('line-height'));
    textAi.setAttribute('fill', compStyle.getPropertyValue('fill'));
    textAi.setAttribute('fill-opacity', compStyle.getPropertyValue('fill-opacity'));
    textAi.removeAttribute('class');
    return textAi;
  }

  static set svg(value) {
    _svgEl = value;
  }

  static get svg() {
    return _svgEl;
  }

  static set style(value) {
    _styleEl = value;
  }

  static get style() {
    return _styleEl;
  }

  static writeStyle(selector, css, style) {
    const styleEl = style || SvgText.style || null;
    if (styleEl && SvgText.svg) {
      selector = `${getSelectorNamespace(SvgText.svg)} ${selector}`;
      writeStyle(selector, css, styleEl);
    }
  }
}

function updateOptions(options) {
  options.uid = uid();
  options = updateEnvironment(options);
  options = updateClassname(options);
  options = updateSizeOptions(options);
  options.attrs = (options.attrs && typeof options.attrs === 'object') ?
    normalizeKeys(options.attrs, 'css') : {};
  return options;
}

// Ensure svg, selectorNamespace, and style properties are set.
function updateEnvironment(options) {
  options.svg = options.svg || _svgEl || null;
  options.styleElement = options.styleElement || _styleEl || null;
  let svgEl = options.element || document.body;
  while (svgEl && svgEl.nodeName.toUpperCase() !== 'SVG') {
    svgEl = svgEl.parentElement;
  }
  svgEl = svgEl || document.body;
  if (svgEl.nodeName.toUpperCase() !== 'SVG') {
    svgEl = createElement('svg', {
      width: 640, height: 480, 'data-svgtext': getSvgUid()
    });
    (options.element || document.body).appendChild(svgEl);
  }
  options.svg = svgEl;
  if (!options.svg.hasAttribute('data-svgtext')) {
    options.svg.setAttribute('data-svgtext', getSvgUid());
  }
  if (!options.selectorNamespace || typeof options.selectorNamespace !== 'string') {
    options.selectorNamespace = getSelectorNamespace(options.svg);
  }
  options.styleElement = options.styleElement || options.svg.querySelector('style');
  if (!options.styleElement) {
    options.styleElement = document.createElement('style');
    const firstChild = options.svg.childNodes[0];
    if (firstChild) {
      options.svg.insertBefore(options.styleElement, firstChild);
    } else {
      options.svg.appendChild(options.styleElement);
    }
  }
  options.element = options.element || options.svg;
  _svgEl = options.svg;
  _styleEl = options.styleElement;
  return options;
}

// Set default className to 'svg-text svg-text-[uid]'.
function updateClassname(options) {
  if (!options.className || typeof options.className !== 'string') {
    options.className = 'svg-text';
  }
  options.className += `.${options.className.split(' ')[0]}-${options.uid}`;
  return options;
}

function offsetByMargin(bounds, margin) {
  bounds.x -= margin[3];
  bounds.y -= margin[0];
  bounds.width += margin[3] + margin[1];
  bounds.height += margin[0] + margin[2];
}

// Create the text element.
function createText(options) {
  const textOptions = normalizeKeys(merge({}, options.attrs,
    { 'ai-id': options.uid }));
  const text = createElement('text', textOptions);
  if (options.className) {
    text.setAttribute('class', options.className.replace(/\./, ' '));
  }
  options.element.appendChild(text);
  return text;
}

function writeStyleAsCss(options) {
  if (options.style && options.styleElement) {
    const selectorNamespace = options.selectorNamespace || null;
    const className = options.className ? ('.' + options.className).replace(' ', '.') : null;
    const textClassName = className ? ('text' + className) : null;
    const selector = [
      selectorNamespace ? (selectorNamespace + ' ') : '',
      textClassName || ''
    ].join('');
    if (selector) {
      writeStyle(selector, options.style, options.styleElement);
    }
  }
}

function sizeBounds(text, options) {
  const p = options.padding;
  const textRect = text.getBoundingClientRect();
  const bounds = {
    x: options.x,
    y: options.y,
    width: textRect.width,
    height: textRect.height,
  };

  bounds.width = isPosNum(options.width) ? options.width : (textRect.width + p[3] + p[1]);
  if (options.align === 'right') {
    bounds.x -= bounds.width;
  } else if (options.align === 'center') {
    bounds.x -= bounds.width / 2;
  }

  bounds.height = isPosNum(options.height) ? options.height :
    (textRect.height + p[0] + p[2]);
  if (options.verticalAlign === 'bottom') {
    bounds.y -= bounds.height;
  } else if (options.verticalAlign === 'middle') {
    bounds.y -= bounds.height / 2;
  }
  return bounds;
}

function sizeRect(rect, bounds, rectSize) {
  if (rect) {
    rect.setAttribute('width',
      isFinite(rectSize.width) ? rectSize.width : bounds.width);
    rect.setAttribute('height',
      isFinite(rectSize.height) ? rectSize.height : bounds.height);
    rect.setAttribute('x', bounds.x + (isFinite(rectSize.x) ? rectSize.x : 0));
    rect.setAttribute('y', bounds.y + (isFinite(rectSize.y) ? rectSize.y : 0));
  }
}

function moveText(text, options, attrs) {
  alignText(text, options.align);
  options = verticalAlignText(text, options, attrs);
  text.setAttribute('transform',
    `translate(${options.textPos.x},${options.textPos.y})`);
}

function alignText(text, align) {
  if (align === 'center') {
    text.setAttribute('text-anchor', 'middle');
  } else if (align === 'right') {
    text.setAttribute('text-anchor', 'end');
  } else if (text.hasAttribute('text-anchor')) {
    text.removeAttribute('text-anchor');
  }
}

function verticalAlignText(text, options, attrs) {
  options.textPos.y += attrs.fontSize;
  if (options.verticalAlign === 'middle') {
    options.textPos.y -= Math.max(attrs.lineHeight,
      textHeight(text, options, attrs)) / 2;
  } else if (options.verticalAlign === 'bottom') {
    options.textPos.y -= textHeight(text, options, attrs);
  }
  return options;
}

function textHeight(text, options, attrs) {
  return Math.max(attrs.fontSize, isPosNum(options.textPos.height) ?
    options.textPos.height : text.getBoundingClientRect().height);
}

function getSelectorNamespace(svg) {
  const svgId = svg.getAttribute('id');
  if (svgId) {
    return `svg#${svgId}`;
  } else {
    const svgAttr = svg.getAttribute('data-svgtext');
    return `svg[data-svgtext="${svgAttr}"]`;
  }
}

// Each text field gets its own unique id so it styles can be namespaced to it
// and also so original SVG text elements can be synced with Illustrator SVG.
let __uid = 0;
function uid() {
  return __uid++;
}

function getSvgUid() {
  let maxId = 0;
  const svgEls = document.querySelectorAll('svg[data-svgtext]');
  for (let i = 0; i < svgEls.length; i++) {
    const id = +(svgEls[i].getAttribute('data-svgtext'));
    maxId = isNaN(id) ? maxId : Math.max(id, maxId);
  }
  return maxId + 1;
}
