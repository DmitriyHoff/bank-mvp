import { el } from 'redom';
import Account from './account';

export default class AccountPage {
  /** @type {HTMLElement} */
  accountsList;

  /** @type {Array.<Account>} */
  accountsListArray = [];

  /** @type {HTMLSelectElement} */
  select;
  /** @type {HTMLElement} */
  addButton;

  /** @type {HTMLElement} */
  container;

  /**
   * @callback onAddButtonClickCallback
   * @param {onAddButtonClickCallback} onAddAccount
   */
  constructor(onAddAccount = null) {
    this.container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.accounts__title', 'Ваши счета'),
        (this.select = el('select.input accounts__order', [
          el('option.accounts__order-option', 'По номеру', {
            value: 'number',
          }),
          el('option.accounts__order-option', 'По балансу', {
            value: 'balance',
          }),
          el('option.accounts__order-option', 'По последней транзакции', {
            value: 'date',
          }),
        ])),
        el('button.btn accounts__add-btn', 'Создать новый счёт'),
      ]),
      el('ul.accounts__list'),
    ]);

    this.accountsList = this.container.querySelector('.accounts__list');
    this.addButton = this.container.querySelector('.accounts__add-btn');

    this.select.addEventListener('change', (e) => {
      this.sortArray(e.target.value);
    });
    if (onAddAccount) {
      this.addButton.addEventListener('click', onAddAccount);
    }
  }
  addAccountToList({ account, balance, transactions }) {
    this.accountsListArray.push(
      new Account({ account, balance, transactions })
    );
    this.refreshContainer();
  }
  refreshContainer() {
    const children = [];
    this.accountsListArray.forEach((account) => {
      children.push(account.html);
    });
    this.accountsList.replaceChildren(...children);
  }
  sortArray(type) {
    switch (type) {
      case 'number':
        this.accountsListArray.sort((a, b) => a.id - b.id);
        break;
      case 'balance':
        this.accountsListArray.sort((a, b) => a.balance - b.balance);
        break;
      case 'date':
        this.accountsListArray.sort(
          (a, b) =>
            new Date(a.lastTransactionDate) - new Date(b.lastTransactionDate)
        );
        break;
    }
    this.refreshContainer();
  }
  get html() {
    return this.container;
  }
}
