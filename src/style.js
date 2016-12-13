import { normalizeKeys } from './keys';

export function writeStyle(selector, textStyle, styleElement) {
  const style = normalizeKeys(textStyle, 'css');
  const css = Object.keys(style).map((key) => {
    return `  ${key}: ${style[key]};`;
  });
  css.unshift(`\n${selector} {`);
  css.push('}\n');
  styleElement.innerHTML += css.join('\n');
}
