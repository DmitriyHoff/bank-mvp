import { el, setChildren } from 'redom';
import Component from './component';
/**
 * Представляет компонет с валютами пользователя
 *
 * @module UserCurrencies
 * @augments Component
 */
export default class UserCurrencies extends Component {
  /** */
  _currencies;

  /** @type {HTMLUListElement} */
  _list;

  /**
   * @class UserCurrencies
   */
  constructor() {
    super();
    this._container = el('.currencies-own exchange__currencies-own', [
      el('h2.currencies-own__title', 'Ваши валюты'),
      el('ul.currencies-own__list'),
    ]);
    this._list = this._container.querySelector('.currencies-own__list');
  }
  /**
   * @param {any} array
   */
  set currencies(array) {
    this._currencies = array;
    this.refreshContainer();
  }

  /**
   *
   */
  refreshContainer() {
    let children = [];

    if (this._currencies) {
      this._currencies.forEach((element) => {
        children.push(
          el('li.currencies-own__list-item', [
            el('p.currencies-own__list-key', `${element.code}`),
            el('p.currencies-own__list-value', `${element.amount.toFixed(2)}`),
          ])
        );
      });
    }
    setChildren(this._list, children);
  }
}
