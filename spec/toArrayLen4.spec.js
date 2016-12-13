import { toArrayLen4 } from '../src/math';


describe('toArrayLen4', () => {

  it('should transform undefined to [0, 0, 0, 0]', () => {
    expect(toArrayLen4(undefined)).toEqual([0, 0, 0, 0]);
  });

  it('should transform null to [0, 0, 0, 0]', () => {
    expect(toArrayLen4(null)).toEqual([0, 0, 0, 0]);
  });

  it('should transform "string" to [0, 0, 0, 0]', () => {
    expect(toArrayLen4("string")).toEqual([0, 0, 0, 0]);
  });

  it('should transform 10 (number) to [10, 10, 10, 10]', () => {
    expect(toArrayLen4(10)).toEqual([10, 10, 10, 10]);
  });

  it('should transform 10.0 to [10, 10, 10, 10]', () => {
    expect(toArrayLen4(10.0)).toEqual([10, 10, 10, 10]);
  });

  it('should transform 10.5 to [10.5, 10.5, 10.5, 10.5]', () => {
    expect(toArrayLen4(10.5)).toEqual([10.5, 10.5, 10.5, 10.5]);
  });

  it('should transform "10" (string) to [10, 10, 10, 10]', () => {
    expect(toArrayLen4("10")).toEqual([10, 10, 10, 10]);
  });

  it('should transform "10px" to [10, 10, 10, 10]', () => {
    expect(toArrayLen4("10px")).toEqual([10, 10, 10, 10]);
  });

  it('should transform "10 20" to [10, 20, 10, 20]', () => {
    expect(toArrayLen4("10 20")).toEqual([10, 20, 10, 20]);
  });

  it('should transform "10px 20px" to [10, 20, 10, 20]', () => {
    expect(toArrayLen4("10px 20px")).toEqual([10, 20, 10, 20]);
  });

  it('should transform "10% 20rem" to [10, 20, 10, 20]', () => {
    expect(toArrayLen4("10% 20rem")).toEqual([10, 20, 10, 20]);
  });

  it('should transform "10px 20px 15px" to [10, 20, 15, 20]', () => {
    expect(toArrayLen4("10px 20px 15px")).toEqual([10, 20, 15, 20]);
  });

  it('should transform "10px 15px 20px 25px" to [10, 15, 20, 25]', () => {
    expect(toArrayLen4("10px 15px 20px 25px")).toEqual([10, 15, 20, 25]);
  });
});
