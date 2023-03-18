// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
import { el, setChildren } from 'redom';
import Component from './component';

/**
 * @typedef {Type.Transaction} Transaction
 * @typedef {Type.Account} Account
 */
/**
 * @module TransactionsList
 * @augments Component
 */
export default class TransactionsList extends Component {
  /** @type {Transaction[]} */
  _transactions;

  /** @type {string} */
  _account;

  /**
   * Инициализирует экземпляр объекта TransactionsList
   *
   * @param {Account} account Объект с информацией о счёте
   * @class TransactionsList
   */
  constructor(account) {
    super();
    this._transactions = account.transactions;
    this._account = account.account;
    this._container = el('.transactions', [
      el('h2.transactions__title', 'История переводов'),
      el('table.transactions__table', [
        el('thead', [
          el('tr.transactions__table-row', [
            el('th.transactions__table-heading', 'Счёт отправителя'),
            el('th.transactions__table-heading', 'Счёт получателя'),
            el('th.transactions__table-heading', 'Сумма'),
            el('th.transactions__table-heading', 'Дата'),
          ]),
        ]),
        el('tbody', []),
      ]),
    ]);
    this.init();
  }

  init() {
    // получаем последние 25 операций
    const list = this._transactions.slice(-25).reverse();
    const children = [];

    list.forEach((element) => {
      let amount;
      const isPositive = element.to === this._account;
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      };
      children.push(
        el('tr.transactions__table-row', [
          el('td.transactions__table-cell', element.from),
          el('td.transactions__table-cell', element.to),
          (amount = el(
            'td.transactions__table-cell',
            `${isPositive ? '+' : '-'} ${element.amount.toFixed(2)}`
          )),
          el(
            'td.transactions__table-cell',
            new Date(element.date).toLocaleDateString('ru-RU', options)
          ),
        ])
      );
      amount.classList.add(isPositive ? '--positive' : '--negative');
    });
    setChildren(this._container.querySelector('tbody'), children);
  }
}
