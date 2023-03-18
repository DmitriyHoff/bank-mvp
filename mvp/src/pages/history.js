// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
import { el, svg, setChildren } from 'redom';
import AccountInfoPage from './account-info';
import AccountChart from '../components/account-chart';

/** @typedef {Type.Account} Account */
/**
 * @module AccountHistoryPage
 * @augments AccountInfoPage
 */
export default class AccountHistoryPage extends AccountInfoPage {
  /**
   * @protected
    @type {AccountChart} */
  _ratioChart;

  /**
   * @param {Account} account Информация о счёте пользователя
    @class AccountHistoryPage */
  constructor({ account }) {
    super({ account });

    this._dynamicChart = new AccountChart(account, 'dynamics', 12);
    this._ratioChart = new AccountChart(account, 'ratio', 12);

    const svgParams = { width: '24', height: '24', viewBox: '0 0 24 24' };
    const icon = svg('svg', svgParams, svg('use', { href: '#arrow' }));

    const btnBack = el('a.btn accounts__add-btn', {
      href: `/account/${this._account}`,
      'data-navigo': '',
    });

    setChildren(btnBack, [icon, el('span', 'Вернуться назад')]);
    this._container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.page-title accounts__title', 'История баланса'),
        btnBack,
      ]),
      el('.accounts__subheader', [
        el('p.accounts__id', `№ ${this._account}`),
        el('p.accounts__balance', `Баланс: ${this.balanceLocaleString}`),
      ]),
      el('.accounts__middle-container', [
        el('.accounts__charts', [
          el('.accounts__dynamic', [this._dynamicChart.html]),
          el('.accounts__ratio accounts__ratio--active', [
            this._ratioChart.html,
          ]),
        ]),
      ]),

      el('.accounts__transactions-wrap', this._transactionsList.html),
    ]);
  }
}
