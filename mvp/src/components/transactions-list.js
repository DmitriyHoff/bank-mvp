// eslint-disable-next-line no-unused-vars
import * as Type from '../typedef';
import { el, setChildren } from 'redom';
import Component from './component';

/**
 * @typedef {Type.Transaction} Transaction
 * @typedef {Type.Account} Account
 */
export default class TransactionsList extends Component {
  /** @type {Transaction[]} */
  _transactions;

  /** @type {string} */
  _account;

  /**
   * @typedef {object} TransactionsListParams
   * @property {Transaction[]} transactions
   * @property {Account} account
   * @param {|TransactionsListParams} params
   */
  constructor(params) {
    super();
    this._transactions = params.transactions;
    this._account = params.account;
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
        el('tbody', [
          el('tr.transactions__table-row', [
            el('td.transactions__table-cell', '0987654321'),
            el('td.transactions__table-cell', '1234567890'),
            el('td.transactions__table-cell --negative', '- 1 234  ₽'),
            el('td.transactions__table-cell', '23.12.2023'),
          ]),
          el('tr.transactions__table-row', [
            el('td.transactions__table-cell', '0987654321'),
            el('td.transactions__table-cell', '1234567890'),
            el('td.transactions__table-cell --positive', '+ 1 234  ₽'),
            el('td.transactions__table-cell', '23.12.2023'),
          ]),
        ]),
      ]),
    ]);
    this.init();
  }

  init() {
    const list = this._transactions.slice(-25);
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
            `${isPositive ? '+' : '-'} ${element.amount}`
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
    console.log(list);
  }
}
