# SvgText
A JavaScript library for creating multiline SVG `<text>` elements. Works seamlessly alongside SVG manipulation libraries such as Snap.svg and D3.

<a href="https://dowjones.github.io/svg-text/">View a demo.</a>

Quick example:
```js
import SvgText from 'svg-text';

// Will render a multiline <text> element into the document's first SVG element.
const text = new SvgText({
  text: 'Lorem ipsum dolor <a href="http://wsj.com">sit amet</a>, consectetur adipiscing elit.',
  element: document.querySelector('svg'),
  maxWidth: 100,
  textOverflow: 'ellipsis',
});

console.log(text.bounds);// { x: 0, y: 0, width: 100, height: 20 }
console.log(text.lines);// 2
console.log(text.text);// Reference to the SVG <text> element
```

## Installation
To import into a client-side that is compiled with Webpack or another module bundling tool:
```
npm install svg-text --save
```
```js
import SvgText from 'svg-text';
const text = new SvgText({options});
```
It can also be used directly in the browser, in which case it will be available as `window.SvgText.default`:
```js
<script src="svg-text.js"></script>
<script>
var SvgText = SvgText.default;
var text = new SvgText(options);
</script>
```

## Compiling, runninh, testing
Compiling and testing are both enabled from the command line. To compile:
```
webpack
```
or (to watch):
```
npm run watch
```
...which is the same as:
```
webpack --watch
```
To run the demo:
```
npm run demo
```
To run unit tests:
```
npm run test
```

## SvgText: options
SvgText must be instantiated with an options object as a parameter. This options object has one property that is mandatory: `text`.

### text
`string` The text to render into the `text` element.

### element
`SVG element` The element that the `text` element will be appended to. If not set, `svg` element will be used.

### svg
`SVG element` If not set, it will be created and appended to `document.body`. It used as a container for the `text` and `style` elements and for namespacing.

### x|y
`number` Defaults to `0` for both properties.

### width|height
`number` Defaults to 'auto' for both properties.

### maxWidth|maxHeight
`number` Defaults to 'auto' for both properties.

### outerWidth|outerHeight
`number` Constrains the overall width or height, including the margin. For example, if the outerWidth is set to 100 and the margin is set to 10, then the width of the actual text will be constrained to 80 pixels. Defaults to 'auto' for both properties.

### maxLines
`number` If not set, possible lines of text are unlimited.

### align
`string` Values: "left", "center", "right". Defaults to "left". Relative to `options.x`, so if the value is "right" then the text will appear to the left of x, if "center" then it will appear centered over x, and if "left" then it will appear to the right of x.

### verticalAlign
`string` Values: "top", "middle", "bottom". Defaults to "top". Relative to `options.y`, so if the value is "bottom" then the text will appear above y, if "middle" then it will appear centered vertically over y, and if "top" then it will appear below y.

### textOverflow
`string` Values: "ellipsis", "clip", or a custom value. A string that is appended to the text if the text overflows the size constraints. "ellipsis" will result in "…" and "clip" in an empty string (""). Examples:
```js
options.textOverflow = 'ellipsis';
options.textOverflow = ' »';
```

### selectorNamespace
`string` An optional selector that will be prefixed to all style selectors to serve as a namespace so that custom styling will apply only to a specific scope. Default is "svg[data-svgtext="[unique id]"]", where "unique id" is set automatically by SvgText. Example:
```js
options.selectorNamespace = 'svg#mySvg';
```

### className
`string` An optional class name to attach to the `text` element. This will be used for custom styling. Default is "svg-text".
```js
options.className = 'demo';
```

### style
`object` Custom styles to apply to the `text` element. Note that because the `text` element is an SVG and not an HTML element, "fill" and not "color" is the correct property to use to color text. Example:
```js
options.style = { fill: 'red', font-family: 'serif', };
```

### styleElement
`HTMLElement` A `style` element into which custom styles will be written. By default, SvgText will use the first `style` element found inside a container `svg` or, if no `style` element exists, create one. Example:
```js
options.style = document.querySelector('svg#mySvg style');
```

### attrs
`object` Attributes to attach to the `text` element. Example:
```js
options.attrs = { 'data-foo': 'bar' };
```

### rect
`object` Attributes to attach to a background `rect` element. If not specified, no `rect` will be drawn. If "x" or "y" is defined, then these values will be added to the SvgText instance's x and y values. In other words, rect.x or rect.y will be treated as offsets or relative positioning values. If "width" or "height" are defined, these values will override any width or height set by the SvgText instance. Example:
```js
options.rect = {
  fill: '#9cf',
  rx: 10,
  ry: 10,
  x: 15
};
```

### padding
`number|string` An optional value that will add space *inside* of a background `rect` or `text` (if no `rect` is drawn). Examples:
```js
options.padding = 10;
options.padding = '15 20';
options.padding = '10px 5px 15px 20px';
```

### margin
`number|string` An optional value that will add space *outside* of a background `rect` or `text` (if no `rect` is drawn). Examples:
```js
options.margin = 10;
options.margin = '15 20';
options.margin = '10px 5px 15px 20px';
```

## SvgText static properties

### svg
Read/write. The container `svg` element into which SvgText instances will be appended and in which a `style` element will be found or created if one is not explicitly defined.

### style
Read/write. The `style` element into which styles for SvgText instances will be written.

## SvgText static methods

### writeStyle(selector, css, style)
Writes CSS styles into a `style` element. It takes two mandatory arguments and one options argument:
- `selector` The CSS selector (appended to selector for the container `svg`).
- `css` A JavaScript object of styles to write.
- `style` The `style` element to write the styles into. If not defined, the value of `SvgText.style` will be used.
Example:
```js
SvgText.writeStyle('text#myText', { fill: 'red' });
```
Result:
```css
<style>
svg[data-svgtext="1"] text#myText { fill: red };
</style>
```

### forIllustrator(textWeb, textAi, postScriptFontName)
Prepares a `text` element for opening in Adobe Illustrator (tested in CS6 and CS2014), with the correct font, weight, style, etc. It takes three arguments:
- `textWeb` A text element that serves as a model.
- `textAi` A text element that will be transformed.
- `postScriptFontName` A PostScript font name that Illustrator will recognize.
Example:
```js
const svg = document.querySelector('svg');
const text = new SvgText({
  text: 'Hello, world!',
  element: svg,
  style: {
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
  },
});
const svgForAi = svg.cloneNode(true);
const el1 = svg.querySelector(`text[ai-id="${text.uid}"]`);
const el2 = svgForAi.querySelector(`text[ai-id="${text.uid}"]`);
SvgText.forIllustrator(el1, el2, 'Helvetica-Bold');
// Now `svgForAi` can be opened in Illustrator and the text element will render
// correctly with Helvetica Bold.
```

## SvgUtil: methods
Utility methods used by SvgText and exposed because they may be useful in other contexts. To import into a project build with modules:
```js
import { SvgUtil } from 'svg-text';
```
To use directly in a web browser:
```js
<script src="svg-text.js"></script>
<script>
var SvgUtil = SvgText.SvgUtil;
var prop = SvgUtil.toJs('font-size'));
</script>
```

### toJs(prop)
Converts a CSS-style property name to a JavaScript-compatible property name. Example:
```js
const prop = SvgUtil.toJs('font-size');
console.log(prop); // 'fontSize'
```

### toCss(prop)
Converts a JavaScript-compatible property name to a CSS-style property name. Example:
```js
const prop = SvgUtil.toCss('fontSize');
console.log(prop); // 'font-size'
```

### normalizeKeys(object, style)
Copies an object and returns the copy with keys transformed to the desired style, either 'js' or 'css'. Default style is 'css'. In addition, it adds 'px' to the values of `font-size` and `line-height` and properties if the original values are raw numbers.
```js
const obj = { 'font-size': '12', 'background-color': 'red' };
const a = SvgUtil.normalizeKeys(obj, 'js');
console.log(a); // { fontSize: '12px', backgroundColor: 'red' }
const b = SvgUtil.normalizeKeys(a);
console.log(b); // { 'font-size': '12px', 'background-color': 'red' }
```

### createElement(name, attrs)
Creates an SVG element with the namespace `http://www.w3.org/2000/svg`. Example:
```js
const attrs = { width: 100, height: 100, rx: 5, ry: 5 };
const el = SvgUtil.createElement('rect', attrs);
// <rect width="100" height="100" rx="5" ry="5"/>
```

### isPosNum(value)
Returns `true` is value is both a number (not `NaN`) and is >= 0.

### minNum(arguments)
Returns the minimum numeric value amongst the arguments, or else "auto".
```js
console.log(SvgUtil.minNum(5, 10, -10)) // 5
console.log(SvgUtil.minNum(-5, -10)) // 'auto'
```

### maxNum(arguments)
Returns the maximum numeric value amongst the arguments, or else "auto".
```js
console.log(SvgUtil.minNum(5, 10, -10)) // 10
console.log(SvgUtil.minNum(-5, -10)) // 'auto'
```

### autoNum(value, altNum)
If value is not a positive number, returns altNum instead.
```js
console.log(SvgUtil.autoNum('auto', 5)); // 5
console.log(SvgUtil.autoNum(10, 5)); // 10
console.log(SvgUtil.autoNum(-5, 5)); // 5
```

### toArrayLen4(value)
Transforms value into an array with 4 numbers.
```js
console.log(SvgUtil.toArrayLen4(10));               // [10, 10, 10, 10]
console.log(SvgUtil.toArrayLen4(undefined));        // [0, 0, 0, 0]
console.log(SvgUtil.toArrayLen4(null));             // [0, 0, 0, 0]
console.log(SvgUtil.toArrayLen4('10px 20px'));      // [10, 20, 10, 20]
console.log(SvgUtil.toArrayLen4("10% 20rem"));      // [10, 20, 10, 20]
console.log(SvgUtil.toArrayLen4("10px 20px 15px")); // [10, 20, 15, 20]
```

## Version History
### v0.4.0
Initial release.
### v0.4.1
Simplify style options and add an optional option: "svg".
### v0.4.2
Fix bug when writing className to the `text` element.
### v0.4.3
For selectorNamespace, use `id` if present before `data-svgtext`.
### v0.4.4
Add writeStyle static method.
### v0.4.5
Fix bug in setting SVG ID.

## Future plans
- Add support for right-to-left languages.
- Implement unit testing on all applicable code.

Special thanks to Elliot Bentley for a ton of great feedback.
