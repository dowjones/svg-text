import isFinite from 'lodash.isfinite';

/**
 * @param {string} prop - String in JavaScript-ready camel case.
 * @returns {string} String hyphenated in CSS style.
 */
export function toJs(prop) {
  return prop.replace(/-([a-z])/g, (match, p1) => {
    return p1.toUpperCase();
  });
}

/**
 * @param {string} prop - String in JavaScript-ready camel case.
 * @returns {string} String hyphenated in CSS style.
 */
export function toCss(prop) {
  return prop.replace(/([A-Z])/g, function (match, p1) {
    return '-' + p1.toLowerCase();
  });
}

/**
 * Returns a copy of @param object with keys transformed to the desired style,
 * either 'js' or 'css'.
 */
export function normalizeKeys(object, style) {
  let normalizedObj = {};
  if (object && typeof object === 'object') {
    const keys = Object.keys(object);
    keys.forEach(key => {
      const normalizedKey = (style === 'js') ? toJs(key) : toCss(key);
      const value = addUnits(key, object[key]);
      normalizedObj[normalizedKey] = value;
    });  
  }
  return normalizedObj;
}

// Default units are pixels (px) so add 'px' to raw numbers.
function addUnits(key, value) {
  switch (key) {
    case 'font-size':
    case 'fontSize':
    case 'line-height':
    case 'lineHeight':
      if (isFinite(value)) {
        value += 'px';
      }
      break;
  }
  return value;
}
