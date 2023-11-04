const TEXT = 'TEXT';
const ELEMENT = 'ELEMENT';

let tag;
let quote;
let status;

export default function extractElements(text) {
  // Enable linebreaks by passing <br> or \n.  Note that space is important.
  text = text.split('<br>').join('\n');
  text = text.split('\n').join('\n ');
  
  const chars = text.split('');
  const tags = [];
  reset();

  chars.forEach((c, index) => {
    switch (status) {
      case TEXT:
        if (c === '<') {
          tag = startTag(c, index);
        }
        break;
      case ELEMENT:
        tag.markup += c;
        const match = c.match(/['"]/);
        if (match) {
          quote = (quote === match[0]) ? null : match[0];
        } else if (!quote && /</.test(c)) {
          tag = startTag(c, index);
        } else if (!quote && />/.test(c)) {
          tags.push(tag);
          status = TEXT;
        }
        break;
    }
  });

  let markupLen = 0;
  tags.forEach(tag => {
    tag.type = /^<\s*\//.test(tag.markup) ? 'close' : 'open';
    tag.name = tag.markup.match(/^<\s*\/*\s*([A-Z][A-Z0-9]*)/i)[1];
    tag.index -= markupLen;
    markupLen += tag.markup.length;
    text = [
      text.substr(0, tag.index),
      text.substr(tag.index + tag.markup.length),
    ].join('');
  });

  linkOpenToCloseTags(tags);
  return { tags, text, chars: text.split('') };
}

function linkOpenToCloseTags(tags) {
  let n = 0;
  while (n < tags.length) {
    const tag = tags[n];
    if (tag.type === 'open') {
      for (let i = n + 1; i < tags.length; i++) {
        const tagNext = tags[i];
        if (tagNext.type === 'close' && tag.name === tagNext.name) {
          tag.close = tagNext;
          break;
        }
      }
    } else {
      // tags.splice(n, 1);
    }
    n++;
  }
}

function reset() {
  tag = quote = null;
  status = TEXT;
}

function startTag(markup, index) {
  status = ELEMENT;
  return { markup, index };
}
