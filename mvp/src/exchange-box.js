import { el } from 'redom';

export default class ExchangeBox {
  #userCurrencies;
  #avaliableCurrencies;

  form;

  /** @type {HTMLSelectElement} */
  selectFrom;

  /** @type {HTMLSelectElement} */
  selectTo;
  container;

  submitHandler;

  constructor() {
    this.container = el('.exchange-box exchange__exchange-box', [
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
    this.form = this.container.querySelector('form');
    this.selectFrom = this.container.querySelector('.input[name="from"]');
    this.selectTo = this.container.querySelector('.input[name="to"]');
    this.inputAmount = this.container.querySelector('.input[name="amount"]');
  }
  get html() {
    return this.container;
  }
  set userCurrencies(currencies) {
    this.#userCurrencies = currencies;
    currencies.forEach((element) => {
      this.selectFrom.append(el('option', element));
    });
  }

  set avaliableCurrencies(currencies) {
    this.#avaliableCurrencies = currencies;
    currencies.forEach((element) => {
      this.selectTo.append(el('option', element));
    });
  }

  addSubmitHandler(handler) {
    this.form.addEventListener('submit', handler);
  }
}
