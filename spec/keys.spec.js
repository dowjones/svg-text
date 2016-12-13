import { toJs, toCss, normalizeKeys } from '../src/keys';

describe('keys', () => {

  it('makes "text-width" compatible with JavaScript', () => {
    expect(toJs('text-width')).toEqual('textWidth');
  });

  it('makes "textWidth" compatible with CSS', () => {
    expect(toCss('textWidth')).toEqual('text-width');
  });

  it('converts {} to CSS', () => {
    var obj = {
      fontSize: 12,
      lineHeight: 24,
    };
    expect(normalizeKeys(obj)).toEqual({
      'font-size': '12px',
      'line-height': '24px',
    });
  });

  it('converts CSS to {}', () => {
    var obj = {
      'font-size': '12px',
      'line-height': '24px',
    };
    expect(normalizeKeys(obj, 'js')).toEqual({
      'fontSize': '12px',
      'lineHeight': '24px',
    });
  });
});
