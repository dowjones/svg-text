import { normalizeKeys } from './keys';
import isFinite from 'lodash.isfinite';
import merge from 'lodash.merge';

/**
 * Tests if a value is a valid number and also >= 0.
 * @returns {boolean}
 */
export function isPosNum(n) {
  return isFinite(n) && n >= 0;
}

/**
 * Returns the minimum numeric value amongst the arguments, or else "auto".
 */
export function minNum() {
  return minMax('min', arguments);
}

/**
 * Returns the maximum numeric value amongst the arguments, or else "auto".
 */
export function maxNum() {
  return minMax('max', arguments);
}

/**
 * If @param value is "auto", return @param altNum instead.
 */
export function autoNum(value, altNum) {
  return isPosNum(value) ? value : altNum;
}

function minMax(compare, args) {
  let value = 'auto';
  for (let i = 0; i < args.length; i++) {
    let n = args[i];
    if (isPosNum(n)) {
      if (isPosNum(value)) {
        if ((compare === 'min' && n < value) ||
            (compare === 'max' && n > value)) {
          value = n;
        }
      } else if (value === 'auto') {
        value = n;
      }
    }
  }
  return value;
}

/**
 * Transforms value into an array with 4 numbers.
 * @param {string|number} value - '10px' or 10
 * @returns {number[]} of length 4
 */
export function toArrayLen4(value) {
  var array;
  var i;
  if (Array.isArray(value)) {
    array = value.slice(0, 4);

  } else if (typeof value === 'string') {
    var parts = value.replace(/^(\s+)|(\s+)$/g, '').split(/\s+/g).slice(0, 4);
    array = parts.length ? parts : [value];

  } else if (isFinite(value)) {
    array = [value];

  } else {
    return [0, 0, 0, 0];
  }

  switch (array.length) {
    case 1:
      for (i = 1; i < 4; i++) {
        array[i] = array[0];
      }
      break;
    case 2:
      array[2] = array[0];
      array[3] = array[1];
      break;
    case 3:
      array[3] = array[1];
      break;
    default:
      break;
  }

  for (i = 0; i < 4; i++) {
    array[i] = parseFloat(array[i]);
    if (isNaN(array[i])) {
      array[i] = 0;
    }
  }
  return array;
}

/**
 * Returns the preferred width or height amongst width and maxWidth or height
 * and maxHeight values in options.
 */
export function bestSize(options, dimension) {
  const maxProp = (dimension === 'height') ? 'maxHeight' : 'maxWidth';
  const prop = (dimension === 'height') ? 'height' : 'width';
  const maxOk = isPosNum(options[maxProp]);
  const valOk = isPosNum(options[prop]);
  if (maxOk && valOk) {
    return Math.min(options[maxProp], options[prop]);
  } else if (maxOk) {
    return options[maxProp];
  } else if (valOk) {
    return options[prop];
  } else {
    return 'auto';
  }
}

/**
 * Validates and updates x, y, width, height, maxWidth, maxHeight options.
 */
export function updateSizeOptions(options) {
  options = merge({}, options);
  options.padding = toArrayLen4(options.padding);
  options.margin = toArrayLen4(options.margin);
  options.x = addMarginToX(+(options.x || 0), options.align, options.margin);
  options.y = addMarginToY(+(options.y || 0), options.verticalAlign, options.margin);
  options.width = isPosNum(options.width) ? options.width : 'auto';
  options.maxWidth = isPosNum(options.maxWidth) ? options.maxWidth : 'auto';
  options.height = isPosNum(options.height) ? options.height : 'auto';
  options.maxHeight = isPosNum(options.maxHeight) ? options.maxHeight : 'auto';
  options.maxLines = isPosNum(options.maxLines) ? options.maxLines : 'auto';
  // options.width = minNum(options.width, options.maxWidth);

  if (isPosNum(options.outerWidth)) {
    const maxWidth = options.outerWidth - options.margin[3] - options.margin[1];
    options.maxWidth = isPosNum(options.maxWidth) ?
      Math.min(maxWidth, options.maxWidth) : maxWidth;
  }
  if (isPosNum(options.outerHeight)) {
    const maxHeight = options.outerHeight - options.margin[0] - options.margin[2];
    options.maxHeight = isPosNum(options.maxHeight) ?
      Math.min(maxHeight, options.maxHeight) : maxHeight;
  }

  options.textPos = createTextPos(options);
  return options;
}

function createTextPos(options) {
  const padding = options.padding;
  const rect = {
    x: addMarginToX(options.x, options.align, options.padding),
    y: addMarginToY(options.y, options.verticalAlign, options.padding),
    width: isPosNum(options.width) ?
      Math.max(0, options.width - padding[3] - padding[1]) : 'auto',
    height: isPosNum(options.height) ?
      Math.max(0, options.height - padding[0] - padding[2]) : 'auto',
    maxWidth: isPosNum(options.maxWidth) ?
      Math.max(0, options.maxWidth - padding[3] - padding[1]) : 'auto',
    maxHeight: isPosNum(options.maxHeight) ?
      Math.max(0, options.maxHeight - padding[0] - padding[2]) : 'auto',
  };
  rect.width = minNum(rect.width, rect.maxWidth);
  return rect;
}

// Also works for padding.
function addMarginToX(x, align, margin) {
  if (align === 'right') {
    x -= margin[1];
  } else if (align === 'center') {
    x += margin[3] / 2;
    x -= margin[1] / 2;
  } else {
    x += margin[3];
  }
  return x;
}

function addMarginToY(y, verticalAlign, margin) {
  if (verticalAlign === 'bottom') {
    y -= margin[2];
  } else if (verticalAlign === 'middle') {
    y += margin[0] / 2;
    y -= margin[2] / 2;
  } else {
    y += margin[0];
  }
  return y;
}
