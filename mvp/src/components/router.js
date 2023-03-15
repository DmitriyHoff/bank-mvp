import Navigo from 'navigo';

export default class Router {
  /** @type {Navigo} */
  _router;

  /**
   * @callback isOnlineCheckCallback
   * @returns {boolean}
   */

  /**
   * @callback pageLoaderCallback
   * @callback pageReadyCallback
   * @callback pageLeaveCallback
   */

  /** @type {isOnlineCheckCallback} */
  _isOnline;

  /** @type {pageLoaderCallback} */
  _loadAtm;

  /** @type {pageLoaderCallback} */
  _loadLogin;

  /** @type {pageLoaderCallback} */
  _loadAccount;

  /** @type {pageLoaderCallback} */
  _loadAccountInfo;

  /** @type {pageLoaderCallback} */
  _loadAccountHistory;

  /** @type {pageLoaderCallback} */
  _loadCurrency;

  /** @type {pageReadyCallback} */
  _currencyReady;

  /** @type {pageLeaveCallback} */
  _currencyLeave;

  /** @type {pageLoaderCallback} */
  _logout;

  /**
   * @typedef RouterParams
   * @type {object}
   * @property {isOnlineCheckCallback} isOnline
   * Функция, которая будет проверять статус авторизации
   * @property {pageLoaderCallback} atmPageLoader
   * Функция, отвечающая за отрисовку страницы банкоматов.
   * @property {pageLoaderCallback} loginPageLoader
   * Функция, отвечающая за отрисовку страницы авторизации.
   * @property {pageLoaderCallback} accountPageLoader
   * Функция, отвечающая за отрисовку страницы со счетами.
   * @property {pageLoaderCallback} accountInfoPageLoader
   * Функция, отвечающая за отрисовку страницы с информацией о счёте.
   * @property {pageLoaderCallback} accountHistoryPageLoader
   * Функция, отвечающая за отрисовку страницы с подробными графиками.
   * @property {pageLoaderCallback} currencyPageLoader
   * Функция, отвечающая за отрисовку страницы курса валют.
   * @property {pageReadyCallback} currencyPageReady
   * Функция, которая вызывается, когда страница валют загружена.
   * @property {pageLeaveCallback} currencyPageLeave
   * Функция, которая вызываетя при переходе со страницы валют на другую.
   * @property {pageLoaderCallback} logoutPageLoader
   * Функция, отвечающая за отрисовку страницы при выходе.
   * @param {RouterParams} params
   */
  constructor({
    isOnline,
    atmPageLoader,
    loginPageLoader,
    accountPageLoader,
    accountInfoPageLoader,
    accountHistoryPageLoader,
    currencyPageLoader,
    currencyPageReady,
    currencyPageLeave,
    logoutPageLoader,
  }) {
    this._isOnline = isOnline;
    this._loadAtm = atmPageLoader;
    this._loadLogin = loginPageLoader;
    this._loadAccount = accountPageLoader;
    this._loadAccountInfo = accountInfoPageLoader;
    this._loadAccountHistory = accountHistoryPageLoader;
    this._loadCurrency = currencyPageLoader;
    this._currencyReady = currencyPageReady;
    this._currencyLeave = currencyPageLeave;
    this._logout = logoutPageLoader;

    this._router = new Navigo('/');

    // Проверка, которая будет выполняться перед загрузкой страниц
    const before = (done) => {
      /* Если пользователь не авторизован
       * отправляем на страницу авторизации */
      if (!this._isOnline()) {
        done(false);
        this._router.navigate('login');
      } else done();
    };

    // Навигация по сайту
    this._router.on({
      '/': {
        uses: () => this._router.navigate('account'),
        hooks: { before },
      },
      '/login': this._loadLogin,
      '/account/:id': {
        uses: this._loadAccountInfo,
        hooks: { before },
      },
      '/history/:id': {
        uses: this._loadAccountHistory,
        hooks: { before },
      },
      '/account': {
        uses: this._loadAccount,
        hooks: { before },
      },

      '/currency': {
        uses: this._loadCurrency,
        hooks: {
          before,
          // Обработка дополнительных событий
          // для включения/отключения сокета
          after: this._currencyReady,
          leave: (done) => {
            this._currencyLeave();
            done();
          },
        },
      },
      '/atm': {
        uses: this._loadAtm,
        hooks: { before },
      },
      '/logout': {
        uses: this._logout,
        hooks: {
          before,
          after: () => {
            this._router.navigate('login');
          },
        },
      },
    });
  }

  resolve() {
    this._router.resolve();
  }

  /** Обновляе все динамически созданные ссылки */
  update() {
    this._router.updatePageLinks();
  }

  /** Переход на другую страницу
   *  @param {string} url Новый адрес */
  navigate(url) {
    this._router.navigate(url);
  }
}
