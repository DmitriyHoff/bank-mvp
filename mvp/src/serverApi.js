/** @constant {string} */
const DEFAULT_URL = 'http://localhost:3000';

export default class ServerAPI extends EventTarget {
  /** @type {string} */
  _url;

  /** @type {string} */
  _token;

  /** @type {boolean} */
  _isOnline;

  /** @type {WebSocket} */
  _socket;

  /** @param {string} url */
  constructor(url = DEFAULT_URL) {
    super();
    this._url = url;
    this.loadToken();
  }

  get isOnline() {
    return this._isOnline;
  }

  /** Записывает полученный `access_token` в `localStorage` */
  saveToken() {
    window.localStorage.setItem('access_token', this._token);
  }

  /** Загружает `access_token` из `localStorage` */
  loadToken() {
    this._token = window.localStorage.getItem('access_token');
    if (this._token) this._isOnline = true;
  }
  /**
   * Выполняет попытку авторизации на сервере
   * @param {string} login Логин
   * @param {string} password Пароль
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
      this._isOnline = true;
      this.saveToken();
    }
    return data;
  }

  async getAccounts() {
    const response = await fetch(this._url + '/accounts', {
      headers: {
        Authorization: `Basic ${this._token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

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

  async transferFunds(from, to, amount) {
    const response = await fetch(this._url + '/transfer-funds', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this._token}`,
      },
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
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
    this._isOnline = false;
    console.log('[server: logout]');
  }
}
