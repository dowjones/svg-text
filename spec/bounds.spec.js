import { isWordBound, isHyphen } from '../src/text';

describe('bounds', () => {

  it('recognizes whitespace as a word bound', () => {
    expect(isWordBound(' ')).toBe(true);
    expect(isWordBound('\t')).toBe(true);
    expect(isWordBound('\r')).toBe(true);
    expect(isWordBound('\n')).toBe(true);
  });

  it('recognizes - as a word bound', () => {
    expect(isWordBound('-')).toBe(true);
  });

  it('recognizes – (en dash) as a word bound', () => {
    expect(isWordBound('–')).toBe(true);
  });

  it('recognizes — (em dash) as a word bound', () => {
    expect(isWordBound('—')).toBe(true);
  });

  it('recognizes – (en dash) as a hyphen', () => {
    expect(isWordBound('–')).toBe(true);
  });

  it('recognizes - (em dash) as a hyphen', () => {
    expect(isWordBound('—')).toBe(true);
  });
});
