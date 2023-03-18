// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
/**
 * @typedef {Type.Account} Account
 * @typedef {Type.Transaction} Transaction
 */

import { el } from 'redom';
// import Transaction from './transaction';
import Component from './component';

/**
 * @module AccountItem
 * @augments Component
 */
export default class AccountItem extends Component {
  /** @type {string} */
  _id;

  /** @type {number} */
  _balance;

  /** @type {Transaction} */
  _lastTransaction;

  /**
   * Инициализирует экземпляр объекта AccountItem
   *
   * @param {Account} account Информация о счёте
   * @class AccountItem
   */
  constructor(account) {
    super();
    this._id = account.account;
    this._balance = account.balance;
    this._lastTransaction =
      account.transactions.length > 0 ? account.transactions.at(-1) : null;
    this._container = el(
      'li.account accounts__list-item',
      el('.account__container', [
        el('p.account__id', `${this._id}`),
        el(
          'p.account__balance',
          `${this._balance.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
          })}`
        ),
        el('.account__bottom-container', [
          el('.account__last-transaction-wrap', [
            el('p.account__last-transaction-label', 'Последняя транзакция'),
            el(
              'p.account__last-transaction-date',
              `${this.lastTransactionDate}`
            ),
          ]),
          el('a.btn account__open-btn', 'Открыть', {
            href: `/account/${this._id}`,
            'data-navigo': '',
          }),
        ]),
      ])
    );
  }

  /**
   * Формирует строку с датой последней транзакции
   *
   * @returns {string} Дата в виде строки или `-`
   */
  get lastTransactionDate() {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', options);
    if (this._lastTransaction) {
      return dateTimeFormat.format(new Date(this._lastTransaction.date));
    } else return '-';
  }
}
