import { el } from 'redom';
import Component from './component';
// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
/** @typedef {Type.RateChange} RateChange */

/**
 * @module CurrenciesRate
 * @augments Component
 */
export default class CurrenciesRate extends Component {
  /**
   * Список объектов
   *
   * @protected
    @type {RateChange[]} */
  _pairs = [];

  /**
   * Список, отражающий курс валют
   *
   * @protected
    @type {HTMLElement} */
  _list;

  /**
   * Создаёт экземпляр объекта CurrenciesRate
   *
   * @class CurrenciesRate
   */
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
   *
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
