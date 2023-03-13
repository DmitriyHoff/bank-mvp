import { el } from 'redom';

export default class LoginBox {
  /** @type {HTMLFormElement} */
  form;

  /** @type {HTMLInputElement} */
  loginInput;

  /** @type {HTMLInputElement} */
  passwordInput;

  /** @type {HTMLButtonElement} */
  submitBtn;

  /** @type {HTMLElement} */
  container;

  /**
   * @callback onFormSubmitCallback
   * @type {onFormSubmitCallback}
   */
  onSubmit;

  constructor() {
    this.container = el(
      '.login-box',
      el('form.form login-box__form', [
        el('h1.form__title', 'Вход в аккаунт'),
        el('label.form__label', 'Логин:'),
        el('input.input form__input', {
          type: 'text',
          placeholder: '',
          name: 'login',
        }),
        el('label.form__label', 'Пароль:'),
        el('input.input form__input', {
          type: 'password',
          placeholder: '',
          name: 'password',
        }),
        el('button.btn form__submit', 'Войти', {
          type: 'submit',
        }),
      ])
    );

    this.form = this.container.querySelector('.form');
    this.loginInput = this.container.querySelector('input[name="login"]');
    this.passwordInput = this.container.querySelector('input[name="password"]');
    this.submitBtn = this.container.querySelector('.form__submit');

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.onSubmit) this.onSubmit();
    });
  }

  render() {
    return this.container;
  }
}
