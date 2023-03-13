import { el } from 'redom';

export default class Header {
  /** @type {HTMLElement} */
  #container;

  /** @type {HTMLElement} */
  #navBar;

  /** @type {boolean} */
  #hasNav;

  constructor() {
    this.#navBar = el(
      'nav.nav header__nav',
      el('ul.nav__list', [
        el(
          'li.nav__list-item',
          el('a.btn nav__link', 'Банкоматы', {
            href: '/atm',
            'data-navigo': '',
          })
        ),
        el(
          'li.nav__list-item',
          el('a.btn nav__link', 'Счета', {
            href: '/account',
            'data-navigo': '',
          })
        ),
        el(
          'li.nav__list-item',
          el('a.btn nav__link', 'Валюта', {
            href: '/currency',
            'data-navigo': '',
          })
        ),
        el(
          'li.nav__list-item',
          el('a.btn nav__link', 'Выйти', {
            href: '/logout',
            'data-navigo': '',
          })
        ),
      ])
    );

    this.#container = el('header.header', el('.header__logo', 'Coin.'));
  }
  render() {
    return this.#container;
  }

  /** Добавляет панель навигации */
  addNavbar() {
    if (!this.#hasNav) {
      this.#container.append(this.#navBar);
    }
    this.#hasNav = !this.#hasNav;
  }

  /** Удаляет панель навигации в header */
  removeNavbar() {
    if (this.#hasNav) {
      this.#navBar.remove();
    }
    this.#hasNav = !this.#hasNav;
  }
}
