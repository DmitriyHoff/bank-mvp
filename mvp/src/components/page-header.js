import { el } from 'redom';
import Component from './component';

/**
 * @module PageHeader
 * @augments Component
 */
export default class PageHeader extends Component {
  /** @type {HTMLElement} */
  _logo;

  /** @type {HTMLElement} */
  _navBar;

  /** @type {boolean} */
  _hasNav;

  /**
   * @class PageHeader
   */
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
    this._logo = el('.header__logo', 'Coin.');
    this._container = el('header.header', this._logo);
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

  /**
   * Устанавливает надпись `offline` на логотипе
   *
   * @param {boolean} isOffline текущий статус
   */
  setOfflineLabel(isOffline) {
    this._logo.classList.toggle('header__logo--offline', isOffline);
  }
}
