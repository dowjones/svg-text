import * as math from '../src/math';

describe('math utils', () => {

  it('identifies a positive number', () => {
    expect(math.isPosNum(5)).toBe(true);
    expect(math.isPosNum(0)).toBe(true);
    expect(math.isPosNum(-5)).toBe(false);
    expect(math.isPosNum(null)).toBe(false);
    expect(math.isPosNum(0/0)).toBe(false);
    expect(math.isPosNum(undefined)).toBe(false);
  });

  it('finds minimum number', () => {
    expect(math.minNum(2, 3, 4)).toEqual(2);
    expect(math.minNum(3, 4, 'a')).toEqual(3);
    expect(math.minNum()).toEqual('auto');
  });

  it('finds maximum number', () => {
    expect(math.maxNum(2, 3, 4)).toEqual(4);
    expect(math.maxNum(3, 4, 'a')).toEqual(4);
    expect(math.maxNum()).toEqual('auto');
  });

  it('returns number or default', () => {
    expect(math.autoNum(2, 4)).toEqual(2);
    expect(math.autoNum('auto', 4)).toEqual(4);
  });

  it('returns best size', () => {
    var obj1 = { width: 100, maxWidth: 200 };
    var obj2 = { width: 100 };
    var obj3 = { maxWidth: 200 };
    expect(math.bestSize(obj1, 'width')).toEqual(100);
    expect(math.bestSize(obj2, 'width')).toEqual(100);
    expect(math.bestSize(obj3, 'maxWidth')).toEqual(200);
    expect(math.bestSize({}, 'width')).toEqual('auto');
  });
});
