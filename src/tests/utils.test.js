import utils from '../utils';

describe('compareAttributes', () => {
  test('Should be equal', () => {
    expect(utils.compareAttributes(undefined, undefined)).toBe(true);
    expect(utils.compareAttributes(1, 1)).toBe(true);
    expect(utils.compareAttributes(['foo', 'bar'], ['foo', 'bar'])).toBe(true);
  });

  test('Should not be equal', () => {
    expect(utils.compareAttributes(['foo'], 1)).toBe(false);
    expect(utils.compareAttributes(['foo'], ['foo', 'bar'])).toBe(false);
    expect(utils.compareAttributes(['foo', 'bar'], ['bar', 'foo'])).toBe(false);
  });
});
