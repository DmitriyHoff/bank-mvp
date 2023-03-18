// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
/**
 * @typedef {import('../helpers/typedef').Account} Account
 * @typedef {import('../helpers/typedef').Transaction} Transaction
 */
import { el, svg, setChildren } from 'redom';
import AccountChart from '../components/account-chart';
import TransactionsList from '../components/transactions-list';
import TransactionBox from '../components/transaction-box';
import Component from '../components/component';

/**
 * Представляет страницу с информацией о счёте
 *
 * @module AccountInfoPage
 * @augments Component
 */
export default class AccountInfoPage extends Component {
  /** @type {string} */
  _account;

  /** @type {number} */
  _balance;

  /** @type {AccountChart} */
  _dynamicChart;

  /** @type {TransactionsList} */
  _transactionsList;

  /** @type {TransactionBox} */
  _transactionsBox;

  /** @type {import('../helpers/typedef').clickCallback} */
  _onChartsClick;

  /**
   * Создаёт экземпляр класса AccountInfoPage
   *
   * @typedef AccountInfoParams
   * @type {object}
   * @property {Account} account Объект счёта пользователя
   * @property {import('../helpers/typedef').clickCallback} chartsCallback Вызывается по клику на график
   * @property {import('../helpers/typedef').transactionCallback} transactionCallback Вызывается по `submit` формы перевода
   * @param {AccountInfoParams} params Параметры
   * @class AccountInfoPage
   */
  constructor({ account, chartsCallback = null, transactionCallback = null }) {
    super();
    this._account = account.account;
    this._balance = account.balance;

    this._transactionsList = new TransactionsList(account);
    this._transactionsBox = new TransactionBox(
      account.account,
      transactionCallback
    );

    this._onChartsClick = chartsCallback;
    this._dynamicChart = new AccountChart(account, 'dynamics', 6);

    const svgParams = { width: '24', height: '24', viewBox: '0 0 24 24' };
    const icon = svg('svg', svgParams, svg('use', { href: '#arrow' }));

    const btnBack = el('a.btn accounts__add-btn', {
      href: '/account',
      'data-navigo': '',
    });
    setChildren(btnBack, [icon, el('span', 'Вернуться назад')]);

    this._container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.page-title accounts__title', 'Просмотр счёта'),
        btnBack,
      ]),
      el('.accounts__subheader', [
        el('p.accounts__id', `№ ${this._account}`),
        el('p.accounts__balance', `Баланс: ${this.balanceLocaleString}`),
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
      console.log('click!');
      this._onChartsClick();
    });
  }
  /**
   * @returns {number} Возвращает значение баланса на счету.
   */
  get balance() {
    return this._balance;
  }

  /**
   * @returns {string} Возвращает значение баланса на счету.
   */
  get balanceLocaleString() {
    return this._balance.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    });
  }

  /**
   * Обновляет информацио осчёте на странице
   *
   * @param {Account} account Объект с информацией о счёте
   */
  updateInfo(account) {
    this._account = account.account;
    this._balance = account.balance;

    this._transactionsList = new TransactionsList(account);
    const wrap = this._container.querySelector('.accounts__transactions-wrap');
    wrap.replaceChildren(this._transactionsList.html);
  }
}
