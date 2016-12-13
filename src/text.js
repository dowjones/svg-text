const ELLIPSIS = '…';

/**
 * Translates a text-overflow code into a corresponding string.
 * @returns {string}
 */
export function textOverflow(code) {
  if (code === 'clip') {
    return '';
  } else if (code === 'ellipsis') {
    return ELLIPSIS;
  } else if (typeof code === 'string') {
    return code;
  }
  return '';
}

/**
 * Returns true if a @param char can be used as a break between words.
 */
export function isWordBound(char) {
  return /[\s-–—]/.test(char);
}

export function isHyphen(char) {
  return /[-–]/.test(char);
}
