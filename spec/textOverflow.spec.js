import { textOverflow } from '../src/text';


describe('textOverflow', () => {

  it('should return "…" for "ellipsis"', () => {
    expect(textOverflow('ellipsis')).toBe('…');
  });

  it('should return "" for "clip"', () => {
    expect(textOverflow('clip')).toBe('');
  });

  it('should return "" for undefined', () => {
    expect(textOverflow(undefined)).toBe('');
  });

  it('should return "" for null', () => {
    expect(textOverflow(null)).toBe('');
  });

  it('should return "" for 77', () => {
    expect(textOverflow(77)).toBe('');
  });

  it('should return ">" for ">"', () => {
    expect(textOverflow('>')).toBe('>');
  });
});
