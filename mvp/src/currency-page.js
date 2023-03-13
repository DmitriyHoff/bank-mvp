import { el } from 'redom';
import UserCurrencies from './user-currencies';
import CurrenciesRate from './currencies-rate';
import ExchangeBox from './exchange-box';

export default class CurrencyPage {
  userCurrencies;
  currenciesRate;
  exchangeBox;

  container;
  constructor() {
    this.container = el('section.exchange', [
      el('h1.exchange__title', 'Валютный обмен'),
      el('.exchange__container'),
    ]);
    this.userCurrencies = new UserCurrencies();
    this.currenciesRate = new CurrenciesRate();
    this.exchangeBox = new ExchangeBox();

    const subContainer = this.container.querySelector('.exchange__container');
    subContainer.append(
      this.userCurrencies.html(),
      this.currenciesRate.html(),
      this.exchangeBox.html()
    );
  }

  get html() {
    return this.container;
  }

  /**
   * Валютные счета пользователя
   * @param {any} array
   */
  set currencies(currencies) {
    const currenciesArray = currencies;
    this.userCurrencies.currencies = currenciesArray;
  }

  setNewCurrencyRate(newRate) {
    const subContainer = this.container.querySelector('.exchange__container');
    subContainer.replaceChild(newRate.html(), this.currenciesRate.html());
    this.currenciesRate = newRate;
  }
}
