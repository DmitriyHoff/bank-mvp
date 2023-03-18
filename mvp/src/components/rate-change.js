// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
/** @typedef {Type.RateChange} RateChange */

import { el } from 'redom';
import Component from './component';

/**
 * @module RateChange
 * @augments Component
 */
export default class RateChange extends Component {
  /** @type {string} */
  _from;
  /** @type {string} */
  _to;
  /** @type {number} */
  _rate;
  /** @type {number} */
  _change;

  /**
   * @param {RateChange} data
   * @class RateChange
   */
  constructor(data) {
    super();
    this._from = data.from;
    this._to = data.to;
    this._rate = parseFloat(data.rate).toFixed(2);
    this._change = parseInt(data.change);
    this._container = el('li.currencies-rate__list-item', [
      el('p.currencies-rate__list-key', `${this._from}/${this._to}`),
      el('p.currencies-rate__list-value', `${this._rate}`, {
        'data-change': `${this._change}`,
      }),
    ]);
  }

  /** @type {string} */
  get from() {
    return this._from;
  }

  /** @type {string} */
  get to() {
    return this._to;
  }

  /** @type {number} */
  get rate() {
    return this._rate;
  }

  /** @type {number} */
  get change() {
    return this._change;
  }
}
