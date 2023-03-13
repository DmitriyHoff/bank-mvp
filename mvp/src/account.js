import { el } from 'redom';
import Transaction from './transaction';

export default class Account {
  /** @type {string} */
  id;

  /** @type {number} */
  balance;

  /** @type {Transaction}*/
  lastTransaction;

  /** @type {HTMLElement} */
  container;

  constructor({ account, balance, transactions }) {
    this.id = account;
    this.balance = balance;
    this.lastTransaction =
      transactions.length > 0 ? new Transaction(transactions.at(-1)) : null;
    this.container = el(
      'li.account accounts__list-item',
      el('.account__container', [
        el('p.account__id', `${this.id}`),
        el(
          'p.account__balance',
          `${this.balance.toLocaleString('ru-RU', {
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
            href: `/account/${this.id}`,
            'data-navigo': '',
          }),
        ]),
      ])
    );
  }

  /** Формирует строку с датой последней транзакции */
  get lastTransactionDate() {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', options);
    if (this.lastTransaction) {
      return dateTimeFormat.format(this.lastTransaction.date);
    } else return '-';
  }
  render() {
    return this.container;
  }
}
