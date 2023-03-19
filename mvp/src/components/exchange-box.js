import { el } from 'redom';
import Component from './component';
import Validator from '../helpers/validator';
/**
 * Представляет компонент обмена валют
 *
 * @module ExchangeBox
 * @augments Component
 */
export default class ExchangeBox extends Component {
  /**
   * Ругурярное выражение для проверки чисел
   *
   * @constant {RegExp}
   * @static
   */
  static REGEX_FLOAT = /^(\d|[1-9]+\d*|0\.\d+|[1-9]+\d*\.\d+)$/;

  /** @type {HTMLFormElement} */
  _form;

  /** @type {HTMLSelectElement} */
  _sourceSelect;

  /** @type {HTMLSelectElement} */
  _destSelect;

  /** @type {HTMLInputElement} */
  _amountInput;

  /** @type {boolean} */
  _hasAmountError = true;

  /** @type {HTMLButtonElement} */
  _submitBtn;

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
              el('.input-wrapper transaction-box__input-wrapper', [
                el('p.error transaction-box__error', ''),
                el('input.input exchange-box__amount', {
                  name: 'amount',
                }),
              ]),
            ]),
          ]),
          el('button.btn exchange-box__submit', 'Отправить', {
            type: 'submit',
            disabled: 'true',
          }),
        ]),
      ]),
    ]);
    this._form = this._container.querySelector('form');
    this._sourceSelect = this._container.querySelector('.input[name="from"]');
    this._destSelect = this._container.querySelector('.input[name="to"]');
    this._amountInput = this._container.querySelector('.input[name="amount"]');
    this._submitBtn = this._container.querySelector('.exchange-box__submit');

    this._sourceSelect.addEventListener('change', () => {
      Validator.setErrorText(this._amountInput, '');
      // проверяем поле
      this._hasAmountError = Validator.checkAmount(this._amountInput);
      this.checkSubmit();
    });

    this._destSelect.addEventListener('change', () => {
      Validator.setErrorText(this._amountInput, '');
      // проверяем поле
      this._hasAmountError = Validator.checkAmount(this._amountInput);
      this.checkSubmit();
    });

    // добавляем обработчик события `input` для поля суммы перевода
    this._amountInput.addEventListener('input', (e) => {
      // сбрасываем ошибку при вводе
      Validator.setErrorText(e.target, false);

      // проверяем поле
      this._hasAmountError = Validator.checkAmount(this._amountInput);

      // проверяем возвожность выполнить запрос
      this.checkSubmit();
    });
  }

  /**
   * @param {string[]} currencies Список кодов валют пользователя
   */
  set userCurrencies(currencies) {
    this._userCurrencies = currencies;
    currencies.forEach((element) => {
      this._sourceSelect.append(el('option', element));
    });
  }

  /**
   * @param {string[]} currencies Список доступных кодов валют
   */
  set avaliableCurrencies(currencies) {
    this._avaliableCurrencies = currencies;
    currencies.forEach((element) => {
      this._destSelect.append(el('option', element));
    });
  }

  /**
   * @callback exchangeCallback
   * @param {exchangeCallback} onSubmit
   */
  addSubmitCallback(onSubmit) {
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(this, {
        from: this._sourceSelect.value,
        to: this._destSelect.value,
        amount: this._amountInput.value,
      });
    });
  }

  /**
   * Устанавливает текст с ошибкой
   *
   * @param {HTMLInputElement|string} input Текстовое поле или его название
   * @param {string} text Текст сообщения об ошибке
   */
  setErrorText(input, text) {
    if (input instanceof HTMLInputElement) {
      Validator.setErrorText(input, text);
    } else {
      if (input === 'amount') {
        Validator.setErrorText(this._amountInput, text);
        this._hasAmountError = true;
      }
    }
    this.checkSubmit();
  }

  /** Проверяет наличие ошибок и изменяет дотупность кнопки `Submit` */
  checkSubmit() {
    this._submitBtn.disabled =
      this._hasAmountError || parseFloat(this._amountInput.value) === 0;
  }

  reset() {
    this._amountInput.value = '';
  }
}
