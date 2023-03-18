import { el, svg, setChildren } from 'redom';
import Component from './component';

/**
 * @module LoginBox
 * @augments Component
 */
export default class LoginBox extends Component {
  /** @type {HTMLFormElement} */
  _form;

  /** @type {HTMLInputElement} */
  _loginInput;

  /** @type {HTMLInputElement} */
  _passwordInput;

  /** @type {HTMLElement} */
  _passwordIconContainer;

  /** @type {HTMLElement} */
  _loginIconContainer;

  /** @type {HTMLButtonElement} */
  _submitBtn;

  /**
   * @callback submitCallback
   * @type {submitCallback}
   * @param {LoginBox}
   */
  onSubmit;

  /**
   * Создает экземпляр LoginBox
   *
   * @class LoginBox
   * @param {submitCallback} onSubmit
   */
  constructor(onSubmit) {
    super();

    this._loginInput = el('input.input form__input', {
      type: 'text',
      placeholder: 'Введите ваш логин',
      name: 'login',
    });
    this._passwordInput = el('input.input form__input', {
      type: 'password',
      placeholder: 'Введите пароль',
      name: 'password',
    });

    this._loginIconContainer = el('.form__icon');
    this._passwordIconContainer = el('.form__icon');

    this._submitBtn = el('button.btn form__submit', 'Войти', {
      type: 'submit',
      disabled: 'true',
    });
    this._container = el(
      '.login-box',
      (this._form = el('form.form login-box__form', [
        el('h1.form__title', 'Вход в аккаунт'),
        el('label.form__label', 'Логин:'),
        this._loginInput,
        this._loginIconContainer,
        el('label.form__label', 'Пароль:'),
        this._passwordInput,
        this._passwordIconContainer,
        this._submitBtn,
      ]))
    );

    this.onSubmit = onSubmit;

    this._loginInput.addEventListener('input', (e) => {
      this.checkSubmit();
      this.setInputError(e.target, false);
    });
    this._passwordInput.addEventListener('input', (e) => {
      this.checkSubmit();
      this.setInputError(e.target, false);
    });

    // Добавляем обработчик события `submit`
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      hasError = !this.checkInputValue(this._loginInput);
      hasError = !this.checkInputValue(this._passwordInput);

      console.log('Errors: ', hasError);
      // если есть ошибки - дальше ничего не делаем
      if (hasError) return;

      // вызываем callback-функцию с параметрами
      this.onSubmit(this, {
        event: e,
        login: this._loginInput.value,
        password: this._passwordInput.value,
      });
    });
  }

  /**
   * @param {HTMLElement} container Контейнер для иконки
   * @param {boolean} enabled Указавает будет ли отображена иконка
   */
  setWarningIcon(container, enabled = true) {
    const svgParams = { width: '24', height: '24', viewBox: '0 0 24 24' };

    const icon = svg(
      'svg.icon-warning',
      svgParams,
      svg('use', { href: '#warning' })
    );

    setChildren(container, enabled ? icon : null);
  }
  /**
   * Устанавливает иконку `check` рядом с текстовым полем
   *
   * @param {HTMLElement} container
   * @param {boolean} enabled
   */
  setCheckIcon(container, enabled = true) {
    const svgParams = { width: '24', height: '24', viewBox: '0 0 24 24' };

    const icon = svg(
      'svg.icon-check',
      svgParams,
      svg('use', { href: '#check' })
    );
    setChildren(container, enabled ? icon : null);
  }

  /**
   * Устанавливает или убирает красную рамку с текстового поля
   *
   * @param {HTMLInputElement} input Текстовое поле
   * @param {boolean} enabled Указывает отображается ли рамка
   */
  setWarningFrame(input, enabled = true) {
    input.classList.toggle('input--warning', enabled);
  }

  /**
   * Устанавливает стили некорректного поля
   *
   * @param {HTMLInputElement|string} input Текстовое поле
   * @param {boolean} enabled Состояние
   */
  setInputError(input, enabled = true) {
    if (input instanceof HTMLInputElement) {
      this.setWarningIcon(input.nextSibling, enabled);
      this.setWarningFrame(input, enabled);
    } else {
      if (input === 'user') {
        this.setInputError(this._loginInput, enabled);
      } else if (input === 'password') {
        this.setInputError(this._passwordInput, enabled);
      }
    }
  }

  /**
   * Устанавливает стили корректного поля
   *
   * @param {HTMLInputElement|string} input Текстовое поле
   * @param {boolean} enabled Указывает отображается ли иконка
   */
  setInputOK(input, enabled = true) {
    if (input instanceof HTMLInputElement) {
      this.setCheckIcon(input.nextSibling, enabled);
    } else {
      if (input === 'user') {
        this.setInputOK(this._loginInput, enabled);
      } else if (input === 'password') {
        this.setInputOK(this._passwordInput, enabled);
      }
    }
  }
  /**
   * Выполняет валидацию текстового поля
   *
   * @param {HTMLInputElement} input
   * @returns {boolean} `true` если корретное значение
   */
  checkInputValue(input) {
    // более 6 любых не пробельных символов
    const regex = /^(\S){6,}$/;
    const value = input.value;
    console.log(`Test:`, regex.test(value));
    if (!regex.test(value)) {
      this.setWarningFrame(input);
      this.setWarningIcon(input.nextSibling);
      return false;
    }
    return true;
  }

  /** Если поля ну пустые  делает доступной кнопку  `submit` */
  checkSubmit() {
    const login = this._loginInput.value;
    const password = this._passwordInput.value;

    const test = !(login.length > 0 && password.length > 0);
    this._submitBtn.disabled = test;
  }
}
