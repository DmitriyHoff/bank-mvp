import { el } from 'redom';
import Component from './component';

export default class LoginBox extends Component {
  /** @type {HTMLFormElement} */
  _form;

  /** @type {HTMLInputElement} */
  _loginInput;

  /** @type {HTMLInputElement} */
  _passwordInput;

  /**
   * @callback submitCallback
   * @type {submitCallback}
   */
  onSubmit;

  /**
   *
   * @param {submitCallback} submitHandler
   */
  constructor(submitHandler) {
    super();
    this._container = el(
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

    this._form = this._container.querySelector('.form');
    this._loginInput = this._container.querySelector('input[name="login"]');
    this._passwordInput = this._container.querySelector(
      'input[name="password"]'
    );
    this._submitBtn = this._container.querySelector('.form__submit');
    this.onSubmit = submitHandler;

    this._loginInput.addEventListener('keydown', (e) => {
      // e.preventDefault();
      console.log('as', e.data);
      return false;
    });
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit({
        event: e,
        login: this._loginInput.value,
        password: this._passwordInput.value,
      });
    });
  }
}
