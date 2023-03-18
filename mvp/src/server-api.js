/**
 * Описывает взаимодействие с сервером
 *
 * @module ServerAPI
 * @augments EventTarget
 */
export default class ServerAPI extends EventTarget {
  /** @constant {string} */
  static DEFAULT_URL = 'http://localhost:3000';

  /** @type {string} */
  _url;

  /** @type {string} */
  _token;

  /** @type {boolean} */
  _hasToken;

  /** @type {WebSocket} */
  _socket;

  /**
   * Инициализирует экземпляр класса ServerAPI
   *
   * @param {string} url Адрес сервера
   * @class ServerAPI
   */
  constructor(url = ServerAPI.DEFAULT_URL) {
    super();
    this._url = url;
    this.loadToken();
  }

  get hasToken() {
    return this._hasToken;
  }

  /** Записывает полученный `access_token` в `localStorage` */
  saveToken() {
    window.localStorage.setItem('access_token', this._token);
  }

  /** Загружает `access_token` из `localStorage` */
  loadToken() {
    this._token = window.localStorage.getItem('access_token');
    if (this._token) this._hasToken = true;
  }
  /**
   * @typedef ServerResponse
   * @type {object}
   * @property {object} data
   *
   * Выполняет попытку авторизации на сервере
   * @property {object} error
   * @param {string} login Логин
   * @param {string} password Пароль
   * @returns {ServerResponse}
   */
  async login(login, password) {
    let url = new URL(this._url + '/login');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });

    const data = await response.json();
    console.log('[server: login] ', data);
    this._token = data.payload?.token;
    if (this._token) {
      this._hasToken = true;
      this.saveToken();
    }
    return data;
  }

  /**
   * Возвращает список счетов пользователя.
   *
   * @returns {ServerResponse}
   */
  async getAccounts() {
    const response = await fetch(this._url + '/accounts', {
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    //console.log(data);
    return data;
  }

  /**
   *
   * @param {*} id
   * @returns
   */
  async getAccount(id) {
    const response = await fetch(this._url + '/account/' + id, {
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    console.log('[server: get account] ', data);
    return data;
  }

  /**
   *
   * @returns
   */
  async createAccount() {
    const response = await fetch(this._url + '/create-account', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    console.log('[server: create account]', data);
    return data;
  }

  /**
   * @typedef {import('./helpers/typedef').TransferFund} TransferFund
   * @param {TransferFund} fund
   * @returns
   */
  async transferFunds(fund) {
    const response = await fetch(this._url + '/transfer-funds', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fund),
    });
    const data = await response.json();
    console.log('[server: transfer funds] ', data);
    return data;
  }

  async getAllCurrencies() {
    const response = await fetch(this._url + '/all-currencies', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    console.log('GET All Currencies:', data);
    return data;
  }

  async getCurrencies() {
    const response = await fetch(this._url + '/currencies', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    console.log('[server: get currencies] ', data);
    return data;
  }

  async buyCurrency({ from, to, amount }) {
    const response = await fetch(this._url + '/currency-buy', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
    });
    const data = await response.json();
    console.log('[server: buy currencies] ', data);
    return data;
  }

  async feedCurrency({ onOpen, onClose, onMessage, onError }) {
    let socketUrl = new URL(this._url);
    socketUrl.protocol = 'ws:';

    this._socket = new WebSocket(socketUrl + 'currency-feed', ['soap', 'wamp']);

    this._socket.onopen = onOpen;
    this._socket.onmessage = onMessage;
    this._socket.onclose = onClose;
    this._socket.onerror = onError;
  }
  async feedCurrencyStop() {
    if (this._socket) this._socket.close();
  }
  async getBanks() {
    const response = await fetch(this._url + '/banks', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    console.log('[server: get banks] ', data);
    return data.payload;
  }
  logout() {
    window.localStorage.removeItem('access_token');
    this._token = null;
    this._hasToken = false;
    console.log('[server: logout]');
  }
}
