import { el } from 'redom';

import AccountInfoPage from './account-info';
import AccountChart from '../components/account-chart';

export default class AccountHistoryPage extends AccountInfoPage {
  /** @type {AccountChart} */
  _ratioChart;

  constructor({ account, balance, transactions }) {
    super({ account, balance, transactions });

    this._dynamicChart = new AccountChart(
      {
        account,
        balance,
        transactions,
        type: 'dynamics',
      },
      12
    );
    this._ratioChart = new AccountChart({
      account,
      balance,
      transactions,
      type: 'ratio',
    });

    this._container = el('section.accounts', [
      el('.accounts__header', [
        el('h1.accounts__title', 'История баланса'),
        el('a.btn accounts__add-btn', 'Вернуться назад', {
          href: `/account/${account}`,
          'data-navigo': '',
        }),
      ]),
      el('.accounts__subheader', [
        el('p.accounts__id', `№ ${this._account}`),
        el('p.accounts__balance', `Баланс: ${this._balance}`),
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
