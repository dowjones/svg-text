import parse from '../src/parse';

describe('parse', () => {

  it('ok', () => {
    expect(parse('ok')).toEqual({
      tags: [],
      text: 'ok',
      chars: ['o', 'k'],
    });
  });

  it('foo bar', () => {
    expect(parse('foo bar')).toEqual({
      tags: [],
      text: 'foo bar',
      chars: 'foo bar'.split(''),
    });
  });

  it('foo <tspan><a href="#">ok</a></tspan> bar', () => {
    expect(parse('foo <tspan><a href="#">ok</a></tspan> bar')).toEqual({
      tags: [{
        index: 4,
        name: 'tspan',
        markup: '<tspan>',
        type: 'open',
        close: {
          index: 6,
          name: 'tspan',
          markup: '</tspan>',
          type: 'close',
        },
      }, {
        index: 4,
        name: 'a',
        markup: '<a href="#">',
        type: 'open',
        close: {
          index: 6,
          name: 'a',
          markup: '</a>',
          type: 'close',
        },
      }, {
        index: 6,
        name: 'a',
        markup: '</a>',
        type: 'close',
      }, {
        index: 6,
        name: 'tspan',
        markup: '</tspan>',
        type: 'close',
      }],
      text: 'foo ok bar',
      chars: ['f','o','o',' ','o','k',' ','b','a','r'],
    });
  });
});
