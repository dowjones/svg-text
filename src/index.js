import SvgText from './SvgText';
import { createElement } from './svg';
import * as math from './math';
import * as keys from './keys';
import * as text from './text';
import * as style from './style';
import assign from 'lodash.assign';

export const SvgUtil = assign({ createElement }, math, keys, text, style);
export default SvgText;
