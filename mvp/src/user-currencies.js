import { el, setChildren } from 'redom';

export default class UserCurrencies {
  #currencies;
  #list;
  container;
  constructor() {
    this.container = el('.currencies-own exchange__currencies-own', [
      el('h2.currencies-own__title', 'Ваши валюты'),
      el('ul.currencies-own__list', [
        el('li.currencies-own__list-item', [
          el('p.currencies-own__list-key', 'USD'),
          el('p.currencies-own__list-value', '576576'),
        ]),
      ]),
    ]);
    this.#list = this.container.querySelector('.currencies-own__list');
  }
  /**
   * @param {any} array
   */
  set currencies(array) {
    this.#currencies = array;
    this.refreshContainer();
  }
  render() {
    return this.container;
  }
  refreshContainer() {
    let children = [];
    console.log('cur', this.#currencies);
    if (this.#currencies) {
      this.#currencies.forEach((element) => {
        children.push(
          el('li.currencies-own__list-item', [
            el('p.currencies-own__list-key', `${element.code}`),
            el('p.currencies-own__list-value', `${element.amount}`),
          ])
        );
      });
    }
    setChildren(this.#list, children);
  }
}
