import { el, svg, setChildren } from 'redom';
import AccountItem from '../components/account-item.js';
import SortButton from '../components/sort-button.js';

export default class AccountPage {
  /** @type {HTMLElement} */
  _accountsList;

  /** @type {AccountItem[]} */
  _accountsListArray = [];

  /** @type {HTMLSelectElement} */
  _select;
  /** @type {HTMLElement} */
  _addButton;

  /** @type {HTMLElement} */
  _container;

  /**
   * @callback addAccountCallback
   * @param {addAccountCallback} onAddAccount
   */
  constructor(onAddAccount = null) {
    this._select = new SortButton((type, asc) => {
      this.sortArray(type, asc);
    });
    this._container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.page-title accounts__title', 'Ваши счета'),
        // (this._select = el('select.input accounts__order', [
        //   el('option.accounts__order-option', 'По номеру', {
        //     value: 'number',
        //   }),
        //   el('option.accounts__order-option', 'По балансу', {
        //     value: 'balance',
        //   }),
        //   el('option.accounts__order-option', 'По последней транзакции', {
        //     value: 'date',
        //   }),
        // ])),
        this._select.html,
        el('button.btn accounts__add-btn', ''),
      ]),
      el('ul.accounts__list'),
    ]);

    this._accountsList = this._container.querySelector('.accounts__list');
    this._addButton = this._container.querySelector('.accounts__add-btn');

    const svgParams = { width: '24', height: '24', viewBox: '0 0 24 24' };
    const icon = svg('svg', svgParams, svg('use', { href: '#plus' }));
    setChildren(this._addButton, [icon, el('span', 'Создать новый счёт')]);

    // this._select.addEventListener('change', (e) => {
    //   this.sortArray(e.target.value);
    // });
    if (onAddAccount) {
      this._addButton.addEventListener('click', onAddAccount);
    }
  }
  addAccount({ account, balance, transactions }) {
    this._accountsListArray.push(
      new AccountItem({ account, balance, transactions })
    );
    this.refreshContainer();
  }
  refreshContainer() {
    const children = [];
    this._accountsListArray.forEach((account) => {
      children.push(account.html);
    });
    this._accountsList.replaceChildren(...children);
  }

  /**
   * Выполняет сортировку массива по критериям
   *
   * @param {string} type Поле, по которому будет производиться сортировка
   * @param {boolean} asc `true` - по возрастанию, `false` - по убыванию
   */
  sortArray(type, asc) {
    const invert = asc ? 1 : -1;
    switch (type) {
      case 'by-number':
        this._accountsListArray.sort((a, b) => (a._id - b._id) * invert);
        break;
      case 'by-balance':
        this._accountsListArray.sort(
          (a, b) => (a._balance - b._balance) * invert
        );
        break;
      case 'by-transaction':
        this._accountsListArray.sort((a, b) => {
          const date1 = new Date(a.lastTransactionDate);
          const date2 = new Date(b.lastTransactionDate);
          return (date1 < date2 ? -1 : date1 > date2 ? 1 : 0) * invert;
        });
        break;
    }
    this.refreshContainer();
  }
  get html() {
    return this._container;
  }
}
