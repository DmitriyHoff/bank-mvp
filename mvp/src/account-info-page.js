import { el } from 'redom';
import AccountChart from './account-chart';
import TransactionsList from './transactions-list';
import NewTransactionBox from './new-transaction-box';

export default class AccountInfoPage {
  /** @type {string} */
  account;

  /** @type {number} */
  balance;

  // /** @type {Array.<object>} */
  // transactions;

  /** @type {AccountChart} */
  dynamicChart;

  /** @type {AccountChart} */
  ratioChart;

  /** @type {TransactionsList} */
  transactionsList;

  /** @type {NewTransactionBox} */
  transactionsBox;

  /** @type {HTMLElement} */
  container;

  constructor({ account, balance, transactions }) {
    this.account = account;
    this.balance = balance;

    this.transactionsList = new TransactionsList({ account, transactions });
    this.transactionsBox = new NewTransactionBox();

    this.dynamicChart = new AccountChart(
      { account, balance, transactions },
      'dynamics'
    );
    this.ratioChart = new AccountChart(
      { account, balance, transactions },
      'ratio'
    );
    this.container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.accounts__title', 'Просмотр счёта'),
        el('a.btn accounts__add-btn', 'Вернуться назад', {
          href: '/account',
          'data-navigo': '',
        }),
      ]),
      el('.accounts__subheader', [
        el('p.accounts__id', `№ ${this.account}`),
        el('p.accounts__balance', `Баланс: ${this.balance}`),
      ]),
      el('.accounts__middle-container', [
        this.transactionsBox.html,
        el('.accounts__charts', [
          el('.accounts__dynamic', [this.dynamicChart.html]),
          el('.accounts__ratio', [this.ratioChart.html], { hidden: true }),
        ]),
      ]),

      el('.accounts__transactions-wrap', this.transactionsList.html),
    ]);

    this.dynamicChart.html.addEventListener('click', () => {
      this.dynamicChart.redraw();
      const ratio = document.querySelector('.accounts__ratio');
      if (!ratio.hidden) {
        setTimeout(() => {
          ratio.hidden = true;
          this.transactionsBox.html.hidden = false;
        }, 500);
      } else {
        this.transactionsBox.html.hidden = true;
        setTimeout(() => (ratio.hidden = false), 0);
      }
      setTimeout(() => ratio.classList.toggle('accounts__ratio--active'), 10);
    });
    // Отслеживаем изменение размера контейнера
    // new ResizeObserver(() => {}).observe(this.dynamicChart.html);
  }

  get html() {
    return this.container;
  }
}
