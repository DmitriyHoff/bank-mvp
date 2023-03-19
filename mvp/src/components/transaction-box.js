import { el, svg, setChildren } from 'redom';
import Component from './component';
import Validator from '../helpers/validator';
/**
 * Форма перевода средств
 *
 * @module TransactionBox
 * @augments Component
 */
export default class TransactionBox extends Component {
  /** @type {string} */
  _account;

  /**
   * @type {boolean}
   */
  _hasDestError = true;

  /**
   * @type {boolean}
   */
  _hasAmountError = true;

  /** @type {HTMLFormElement} */
  _form;

  /** @type {HTMLInputElement} */
  _destInput;

  /** @type {HTMLInputElement} */
  _amountInput;

  /** @type {HTMLButtonElement} */
  _submitBtn;

  /**
   * @typedef {import('../helpers/typedef').transactionCallback} transactionCallback
   * @type {transactionCallback}
   */
  _onSubmit;

  /**
   * @param {string} account
   * @param {transactionCallback} transactionCallback
   * @class TransactionBox
   */
  constructor(account, transactionCallback = null) {
    super();
    this._account = account;
    this._onSubmit = transactionCallback;
    this._destInput = el('input.input form__input', {
      type: 'text',
      placeholder: 'Счёт получателя',
      name: 'dest',
    });
    this._amountInput = el('input.input form__input', {
      type: 'text',
      placeholder: 'Сумма перевода',
      name: ' amount',
    });
    this._submitBtn = el('button.btn icon-btn form__submit', {
      type: 'submit',
      disabled: 'true',
    });
    const svgParams = { width: '24', height: '24', viewBox: '0 0 24 24' };
    const icon = svg('svg', svgParams, svg('use', { href: '#mail' }));
    setChildren(this._submitBtn, [icon, el('span', 'Отправить')]);

    this._container = el('.accounts__transaction-box', [
      (this._form = el('form.form transaction-box__form', [
        el('h2.form__title transaction-box__title', 'Новый перевод'),
        el('label.form__label transaction-box__label', 'Счёт получателя'),
        el('.transaction-box__input-wrapper', [
          el('p.transaction-box__error', ''),
          this._destInput,
        ]),
        el('label.form__label transaction-box__label', 'Сумма перевода'),
        el('.input-wrapper transaction-box__input-wrapper', [
          el('p.error transaction-box__error', ''),
          this._amountInput,
        ]),
        this._submitBtn,
      ])),
    ]);

    // добавляем обработчик события `submit` для формы
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();

      this._onSubmit(this, {
        from: this._account,
        to: this._destInput.value,
        amount: this._amountInput.value,
      });
    });

    // добавляем обработчик события `input` для поля номера счёта
    this._destInput.addEventListener('input', (e) => {
      // сбрасываем ошибку при вводе
      Validator.setWarningFrame(e.target, false);

      // проверяем поле
      this._hasDestError = this.checkDestination();

      // проверяем возвожность выполнить запрос
      this.checkSubmit();
    });

    // добавляем обработчик события `input` для поля суммы перевода
    this._amountInput.addEventListener('input', (e) => {
      // сбрасываем ошибку при вводе
      Validator.setWarningFrame(e.target, false);

      // проверяем поле
      this._hasAmountError = Validator.checkAmount(this._amountInput);

      // проверяем возвожность выполнить запрос
      this.checkSubmit();
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
      if (input === 'dest') {
        Validator.setErrorText(this._destInput, text);
        this._hasDestError = true;
      } else if (input === 'amount') {
        Validator.setErrorText(this._amountInput, text);
        this._hasAmountError = true;
      }
    }
    this.checkSubmit();
  }
  /**
   * Проверяет на корректность поле ввода номера счёта
   *
   * @returns {boolean} Указывает на наличие ошибок
   */
  checkDestination() {
    const dest = this._destInput.value;
    const minLength = dest.length > 0;

    if (!minLength) {
      Validator.setErrorText(this._destInput, '');
      return true;
    }

    const another = this._account !== dest;
    if (!another) {
      Validator.setErrorText(this._destInput, 'Введите другой номер счёта');
      return true;
    }

    Validator.setErrorText(this._destInput, '');
    return false;
  }

  /** Проверяет наличие ошибок и изменяет дотупность кнопки `Submit` */
  checkSubmit() {
    this._submitBtn.disabled =
      this._hasAmountError ||
      this._hasDestError ||
      parseFloat(this._amountInput.value) === 0;
  }

  reset() {
    this._destInput.value = '';
    this._amountInput.value = '';
  }
}
