import { el } from 'redom';
import Component from './component';

export default class PageHeader extends Component {
  /** @type {HTMLElement} */
  _container;

  /** @type {HTMLElement} */
  _navBar;

  /** @type {boolean} */
  _hasNav;

  constructor() {
    super();
    this._navBar = el(
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

    this._container = el('header.header', el('.header__logo', 'Coin.'));
  }
  get html() {
    return this._container;
  }

  /** Добавляет панель навигации */
  addNavbar() {
    if (!this._hasNav) {
      this._container.append(this._navBar);
    }
    this._hasNav = !this._hasNav;
  }

  /** Удаляет панель навигации в header */
  removeNavbar() {
    if (this._hasNav) {
      this._navBar.remove();
    }
    this._hasNav = !this._hasNav;
  }
}
