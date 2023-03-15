import { el, setChildren } from 'redom';
import Component from './component';

export default class UserCurrencies extends Component {
  _currencies;

  /** @type {HTMLUListElement} */
  _list;

  /** @type {HTMLElement} */
  _container;
  constructor() {
    super();
    this._container = el('.currencies-own exchange__currencies-own', [
      el('h2.currencies-own__title', 'Ваши валюты'),
      el('ul.currencies-own__list', [
        el('li.currencies-own__list-item', [
          el('p.currencies-own__list-key', 'USD'),
          el('p.currencies-own__list-value', '576576'),
        ]),
      ]),
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
  get html() {
    return this._container;
  }
  refreshContainer() {
    let children = [];
    console.log('cur', this._currencies);
    if (this._currencies) {
      this._currencies.forEach((element) => {
        children.push(
          el('li.currencies-own__list-item', [
            el('p.currencies-own__list-key', `${element.code}`),
            el('p.currencies-own__list-value', `${element.amount}`),
          ])
        );
      });
    }
    setChildren(this._list, children);
  }
}
