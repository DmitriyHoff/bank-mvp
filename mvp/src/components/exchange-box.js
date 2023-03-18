import { el } from 'redom';
import Component from './component';

/**
 * @module ExchangeBox
 * @augments Component
 */
export default class ExchangeBox extends Component {
  /** @type {HTMLFormElement} */
  _form;

  /** @type {HTMLSelectElement} */
  _selectFrom;

  /** @type {HTMLSelectElement} */
  _selectTo;
  // container;

  /** @type {HTMLInputElement} */
  _inputAmount;

  /**
   * @class ExchangeBox
   */
  constructor() {
    super();
    this._container = el('.exchange-box exchange__exchange-box', [
      el('form.exchange-box__form', [
        el('h2.exchange-box__title', 'Обмен валюты'),
        el('.exchange-box__container', [
          el('.exchange-box__subcontainer', [
            el('.exchange-box__input-wrap', [
              el('label.exchange-box__label', 'Из'),
              el('select.input exchange-box__select', {
                name: 'from',
              }),
              el('label.exchange-box__label', 'в'),
              el('select.input exchange-box__select', {
                name: 'to',
              }),
            ]),
            el('.exchange-box__input-wrap', [
              el('label.exchange-box__label', 'сумма'),
              el('input.input exchange-box__amount', {
                type: 'number',
                name: 'amount',
              }),
            ]),
          ]),
          el('button.btn exchange-box__submit', 'Отправить'),
        ]),
      ]),
    ]);
    this._form = this._container.querySelector('form');
    this._selectFrom = this._container.querySelector('.input[name="from"]');
    this._selectTo = this._container.querySelector('.input[name="to"]');
    this._inputAmount = this._container.querySelector('.input[name="amount"]');
  }

  /** @param {string[]} currencies */
  set userCurrencies(currencies) {
    this._userCurrencies = currencies;
    currencies.forEach((element) => {
      this._selectFrom.append(el('option', element));
    });
  }

  /** @param {string[]} currencies */
  set avaliableCurrencies(currencies) {
    this._avaliableCurrencies = currencies;
    currencies.forEach((element) => {
      this._selectTo.append(el('option', element));
    });
  }

  /**
   * @callback submitCallback
   * @param {SubmitEvent}
   * @param {submitCallback} onSubmit
   */
  addSubmitCallback(onSubmit) {
    this._form.addEventListener('submit', onSubmit);
  }
}
