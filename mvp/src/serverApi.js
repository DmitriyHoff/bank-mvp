export default class ServerAPI extends EventTarget {
  url;
  token;
  #isOnline = false;
  socket;
  constructor(url = 'http://localhost:3000') {
    super();
    this.url = url;
    this.loadToken();
  }

  get isOnline() {
    return this.#isOnline;
  }
  saveToken() {
    window.localStorage.setItem('access_token', this.token);
  }
  loadToken() {
    this.token = window.localStorage.getItem('access_token');
    if (this.token) this.#isOnline = true;
  }
  /**
   * Авторизоваться
   * @param {string} login Логин
   * @param {string} password Пароль
   */
  async login(login, password) {
    let url = new URL(this.url + '/login');
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
    this.token = data.payload?.token;
    if (this.token) {
      this.#isOnline = true;
      this.saveToken();
    }
    return data;
  }

  async getAccounts() {
    const response = await fetch(this.url + '/accounts', {
      headers: {
        Authorization: `Basic ${this.token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  async getAccount(id) {
    const response = await fetch(this.url + '/account/' + id, {
      headers: {
        Authorization: `Basic ${this.token}`,
      },
    });
    const data = await response.json();
    console.log('[server: get account] ', data);
    return data;
  }

  async createAccount() {
    const response = await fetch(this.url + '/create-account', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.token}`,
      },
    });
    const data = await response.json();
    console.log('[server: create account]', data);
    return data;
  }

  async transferFunds(from, to, amount) {
    const response = await fetch(this.url + '/transfer-funds', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.token}`,
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
    const response = await fetch(this.url + '/all-currencies', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.token}`,
      },
    });
    const data = await response.json();
    console.log('GET All Currencies:', data);
    return data;
  }

  async getCurrencies() {
    const response = await fetch(this.url + '/currencies', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.token}`,
      },
    });
    const data = await response.json();
    console.log('[server: get currencies] ', data);
    return data;
  }

  async buyCurrency({ from, to, amount }) {
    const response = await fetch(this.url + '/currency-buy', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.token}`,
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
    let socketUrl = new URL(this.url);
    socketUrl.protocol = 'ws:';

    this.socket = new WebSocket(socketUrl + 'currency-feed', ['soap', 'wamp']);

    this.socket.onopen = onOpen;
    this.socket.onmessage = onMessage;
    this.socket.onclose = onClose;
    this.socket.onerror = onError;
  }
  async feedCurrencyStop() {
    if (this.socket) this.socket.close();
  }
  async getBanks() {
    const response = await fetch(this.url + '/banks', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${this.token}`,
      },
    });
    const data = await response.json();
    console.log('[server: get banks] ', data);
    return data.payload;
  }
  logout() {
    window.localStorage.removeItem('access_token');
    this.token = null;
    this.#isOnline = false;
    console.log('[server: logout]');
  }
}
