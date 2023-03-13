import { el } from 'redom';

export default class CurrenciesRate {
  /** @type {Array.<RateChange>} */
  pairs = [];

  /** @type {HTMLElement} */
  #list;

  /** @type {HTMLElement} */
  container;
  constructor() {
    this.#list = el('ul.currencies-rate__list');
    this.container = el('.currencies-rate exchange__currencies-rate', [
      el('h2.currencies-rate__title', 'Изменение курсов в реальном времени'),
      this.#list,
    ]);
  }
  render() {
    return this.container;
  }

  /**
   * Обновляет валютную пару или добавляет новую
   * @param {RateChange} newRate
   */
  pushRate(newRate) {
    const index = this.pairs.findIndex(
      (element) => element.from === newRate.from && element.to === newRate.to
    );
    if (index !== -1) {
      this.#list.replaceChild(newRate.render(), this.pairs[index].render());
      this.pairs[index] = newRate;
    } else {
      this.pairs.push(newRate);
      this.#list.appendChild(newRate.render());
    }
  }
}
