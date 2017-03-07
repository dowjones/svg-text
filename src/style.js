import { normalizeKeys } from './keys';

export function writeStyle(selector, textStyle, styleElement) {
  const style = normalizeKeys(textStyle, 'css');
  const css = Object.keys(style).map((key) => {
    return `  ${key}: ${style[key]};`;
  });
  css.unshift(`\n${selector} {`);
  css.push('}');
  css.unshift(getPreviousCss(styleElement));
  styleElement.innerHTML += css.join('\n');
}

function getPreviousCss(el) {
  let css = '';
  Array.prototype.slice.call(el.childNodes).forEach(el => {
    css += el.textContent;
  });
  return css;
}
