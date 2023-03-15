import { el } from 'redom';
import AccountChart from '../components/account-chart';
import TransactionsList from '../components/transactions-list';
import TransactionBox from '../components/transaction-box';
import Component from '../components/component';

export default class AccountInfoPage extends Component {
  /** @type {string} */
  _account;

  /** @type {number} */
  _balance;

  /** @type {AccountChart} */
  _dynamicChart;

  // /** @type {AccountChart} */
  // _ratioChart;

  /** @type {TransactionsList} */
  _transactionsList;

  /** @type {TransactionBox} */
  _transactionsBox;

  /**
   * @callback onClickCallback
   * @param {Event} e
   */

  /** @type {onClickCallback} */
  _onClickCallback;

  /**
   * @typedef
   * @param {*} param0
   * @param {*} onClickCallback
   */
  constructor({ account, balance, transactions }, onClickCallback = null) {
    super();
    this._account = account;
    this._balance = balance;

    this._transactionsList = new TransactionsList({ account, transactions });
    this._transactionsBox = new TransactionBox();

    this._onClickCallback = onClickCallback;
    this._dynamicChart = new AccountChart(
      {
        account,
        balance,
        transactions,
        type: 'dynamics',
      },
      6
    );
    // this._ratioChart = new AccountChart({
    //   account,
    //   balance,
    //   transactions,
    //   type: 'ratio',
    // });
    this._container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.accounts__title', 'Просмотр счёта'),
        el('a.btn accounts__add-btn', 'Вернуться назад', {
          href: '/account',
          'data-navigo': '',
        }),
      ]),
      el('.accounts__subheader', [
        el('p.accounts__id', `№ ${this._account}`),
        el('p.accounts__balance', `Баланс: ${this._balance}`),
      ]),
      el('.accounts__middle-container', [
        this._transactionsBox.html,
        el('.accounts__charts', [
          el('.accounts__dynamic', [this._dynamicChart.html]),
          // el('.accounts__ratio', [this._ratioChart.html], { hidden: true }),
        ]),
      ]),

      el('.accounts__transactions-wrap', this._transactionsList.html),
    ]);

    this._dynamicChart.html.addEventListener('click', () => {
      this._onClickCallback();
      // this._dynamicChart.redraw();
      // const ratio = document.querySelector('.accounts__ratio');
      // if (!ratio.hidden) {
      //   setTimeout(() => {
      //     ratio.hidden = true;
      //     this._transactionsBox.html.hidden = false;
      //   }, 500);
      // } else {
      //   this._transactionsBox.html.hidden = true;
      //   setTimeout(() => (ratio.hidden = false), 0);
      // }
      // setTimeout(() => ratio.classList.toggle('accounts__ratio--active'), 10);
    });
    // Отслеживаем изменение размера контейнера
    // new ResizeObserver(() => {}).observe(this.dynamicChart.html);
  }

  // get html() {
  //   return this.#container;
  // }

  get balance() {
    return this._balance;
  }
}
