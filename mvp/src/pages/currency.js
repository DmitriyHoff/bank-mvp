import { el } from 'redom';
import UserCurrencies from '../components/user-currencies';
import CurrenciesRate from '../components/currencies-rate';
import ExchangeBox from '../components/exchange-box';
import Component from '../components/component';

/**
 * Представляет страницу с курсом валют
 *
 * @module CurrencyPage
 * @augments Component
 */
export default class CurrencyPage extends Component {
  /** @type {UserCurrencies} */
  _userCurrencies;

  /** @type {CurrenciesRate} */
  _currenciesRate;

  /** @type {ExchangeBox} */
  _exchangeBox;

  /**
   * @class CurrencyPage
   */
  constructor() {
    super();
    this._container = el('section.exchange', [
      el('h1.page-title exchange__title', 'Валютный обмен'),
      el('.exchange__container'),
    ]);
    this._userCurrencies = new UserCurrencies();
    this._currenciesRate = new CurrenciesRate();
    this._exchangeBox = new ExchangeBox();

    const subContainer = this._container.querySelector('.exchange__container');
    subContainer.append(
      this._userCurrencies.html,
      this._currenciesRate.html,
      this._exchangeBox.html
    );
  }

  /**
   * Валютные счета пользователя
   *
   * @typedef {object} Currency
   * @property {string} code
   * @property {number} amount
   * @param {Currency[]} currencies
   */
  set currencies(currencies) {
    console.log('>', currencies);
    const currenciesArray = currencies;
    this._userCurrencies.currencies = currenciesArray;
  }

  /**
   * Заменяет данные в списке курса обмена валют
   *
   * @param {CurrenciesRate} rate
   */
  setNewCurrencyRate(rate) {
    const subContainer = this._container.querySelector('.exchange__container');
    subContainer.replaceChild(rate.html, this._currenciesRate.html);
    this._currenciesRate = rate;
  }
}
