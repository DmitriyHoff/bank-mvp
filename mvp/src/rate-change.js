import { el } from 'redom';

export default class RateChange {
  /** @type {string} */
  from;
  /** @type {string} */
  to;
  /** @type {number} */
  rate;
  /** @type {number} */
  change;

  container;
  /**
   * Конструктор
   * @param {string} from
   * @param {string} to
   * @param {number} rate
   * @param {number} change
   */
  constructor(from, to, rate, change) {
    this.from = from;
    this.to = to;
    this.rate = parseFloat(rate);
    this.change = parseInt(change);
    this.container = el('li.currencies-rate__list-item', [
      el('p.currencies-rate__list-key', `${this.from}/${this.to}`),
      el('p.currencies-rate__list-value', `${this.rate}`, {
        'data-change': `${this.change}`,
      }),
    ]);
  }

  render() {
    return this.container;
  }
}
