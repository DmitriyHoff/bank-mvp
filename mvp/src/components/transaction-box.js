import { el, svg, setChildren } from 'redom';
import Component from './component';

/**
 * Форма перевода средств
 *
 * @module TransactionBox
 * @augments Component
 */
export default class TransactionBox extends Component {
  /**
   * @constant {RegExp}
   * @static
   */
  static REGEX_FLOAT = /^(\d|[1-9]+\d*|0\.\d+|[1-9]+\d*\.\d+)$/;

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
        el('.transaction-box__input-wrapper', [
          el('p.transaction-box__error', ''),
          this._amountInput,
        ]),
        this._submitBtn,
      ])),
    ]);

    // добавляем обработчик события `submit` для формы
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Submit');

      // Выполняем базовую проверку
      let hasError = false;
      const destAccount = this._destInput.value;
      const amount = this._amountInput.value;
      if (destAccount === this._account || destAccount === '') {
        hasError = true;
        this.setWarningFrame(this._destInput);
      }
      // Проверка корректности числа
      if (amount === '' || !TransactionBox.REGEX_FLOAT.test(amount)) {
        hasError = true;
        this.setWarningFrame(this._amountInput);
      }

      if (hasError) return;
      this._onSubmit({
        from: this._account,
        to: this._destInput.value,
        amount: this._amountInput.value,
      });
    });

    // добавляем обработчик события `input` для полей
    this._destInput.addEventListener('input', (e) => {
      this._hasDestError = this.checkDestination();
      this.setWarningFrame(e.target, false);
      this.checkSubmit();
    });
    // добавляем обработчик события `input` для полей
    this._amountInput.addEventListener('input', (e) => {
      this._hasAmountError = this.checkAmount();
      this.setWarningFrame(e.target, false);
      this.checkSubmit();
    });
  }

  /**
   * Устанавливает или убирает красную рамку с текстового поля
   *
   * @param {HTMLInputElement} input
   * @param {boolean} warning
   */
  setWarningFrame(input, warning = true) {
    input.classList.toggle('input--warning', warning);
  }

  /**
   * Устанавливает текст с ошибкой
   *
   * @param {HTMLInputElement|string} input Текстовое поле или его название
   * @param {string} text Текст сообщения об ошибке
   */
  setErrorText(input, text) {
    if (input instanceof HTMLInputElement) {
      input.parentElement.firstElementChild.innerHTML = text;
    } else {
      if (input === 'dest') {
        this.setErrorText(this._destInput, text);
      } else if (input === 'amount') {
        this.setErrorText(this._amountInput, text);
      }
    }
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
      this.setErrorText(this._destInput, '');
      return true;
    }

    const another = this._account !== dest;
    if (!another) {
      this.setErrorText(this._destInput, 'Введите другой номер счёта');
      return true;
    }

    this.setErrorText(this._destInput, '');
    return false;
  }
  /**
   * Проверяет на корректность поле ввода суммы перевода
   *
   * @returns {boolean} Указывает на наличие ошибок
   */
  checkAmount() {
    const amount = this._amountInput.value;
    const minLength = amount.length > 0;

    if (!minLength) {
      this.setErrorText(this._amountInput, '');
      return true;
    }

    const floatTest = TransactionBox.REGEX_FLOAT.test(amount);
    if (!floatTest) {
      this.setErrorText(this._amountInput, 'Некорректное число');
      return true;
    }

    this.setErrorText(this._amountInput, '');
    return false;
  }

  /** Проверяет поле суммы перевода */
  checkSubmit() {
    console.log(parseFloat(this._amountInput.value));
    this._submitBtn.disabled =
      this._hasAmountError ||
      this._hasDestError ||
      parseFloat(this._amountInput.value) === 0;
  }
}
