import { el } from 'redom';
import Component from './component';

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
   * @typedef RateChangeParams
   * @type {object}
   * @property {string} from Код валюты, из которой производится конвертирование
   * @property {string} to Код валюты, в которую производится конвертирование
   * @property {number} rate  Курс обмена валют
   * @property {number} change изменение курса по отношению к предыдущему значению:
   * `1` - возрастание курса, `-1` - убывание курса, `0` - курс не изменился.
   * @param {RateChangeParams} data
   */
  constructor(data) {
    super();
    this._from = data.from;
    this._to = data.to;
    this._rate = parseFloat(data.rate);
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
