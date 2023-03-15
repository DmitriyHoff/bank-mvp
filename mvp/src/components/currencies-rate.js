import { el } from 'redom';
import Component from './component';

export default class CurrenciesRate extends Component {
  /** @type {[]RateChange} */
  _pairs = [];

  /** @type {HTMLElement} */
  _list;

  constructor() {
    super();
    this._list = el('ul.currencies-rate__list');
    this._container = el('.currencies-rate exchange__currencies-rate', [
      el('h2.currencies-rate__title', 'Изменение курсов в реальном времени'),
      this._list,
    ]);
  }

  /**
   * Обновляет валютную пару или добавляет новую
   * @param {RateChange} newRate
   */
  pushRate(newRate) {
    const index = this._pairs.findIndex(
      (element) => element.from === newRate.from && element.to === newRate.to
    );
    if (index !== -1) {
      this._list.replaceChild(newRate.html, this._pairs[index].html);
      this._pairs[index] = newRate;
    } else {
      this._pairs.push(newRate);
      this._list.appendChild(newRate.html);
    }
  }
}
