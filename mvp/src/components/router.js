// eslint-disable-next-line no-unused-vars
import Navigo from 'navigo';
/**
 * @typedef {import('../helpers/typedef').pageLoaderCallback} pageLoaderCallback
 * @typedef {import('../helpers/typedef').pageReadyCallback} pageReadyCallback
 * @typedef {import('../helpers/typedef').pageLeaveCallback} pageLeaveCallback
 * @typedef {import('../helpers/typedef').tokenCheckCallback} tokenCheckCallback
 * @typedef {import('../helpers/typedef').networkCheckCallback} networkCheckCallback
 * @typedef {import('../helpers/typedef').RouterParams} RouterParams
 */
/**
 * Представляет маршрутизатор по страницам приложения
 *
 * @module Router
 */
export default class Router {
  /** @type {Navigo} */
  _router;

  /** @type {networkCheckCallback} */
  _networkCheck;

  /** @type {tokenCheckCallback} */
  _tokenCheck;

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

  /** @param {RouterParams} params */

  /**
   * Инициализирует экземпляр класса Router
   *
   * @class Router
   * @param {RouterParams} callbacks
   * Функции, которые будут вызваны при переходах на страницы
   */
  constructor(callbacks) {
    this._networkCheck = callbacks.networkCheck;
    this._tokenCheck = callbacks.tokenCheck;
    this._loadAtm = callbacks.atmPageLoader;
    this._loadLogin = callbacks.loginPageLoader;
    this._loadAccount = callbacks.accountPageLoader;
    this._loadAccountInfo = callbacks.accountInfoPageLoader;
    this._loadAccountHistory = callbacks.accountHistoryPageLoader;
    this._loadCurrency = callbacks.currencyPageLoader;
    this._currencyReady = callbacks.currencyPageReady;
    this._currencyLeave = callbacks.currencyPageLeave;
    this._logout = callbacks.logoutPageLoader;

    this._router = new Navigo('/');

    // Проверка, которая будет выполняться перед загрузкой страниц
    const before = (done) => {
      /* Проверяем соединение и токен */
      const isOnline = this._networkCheck();
      const hasToken = this._tokenCheck();

      // Если сеть недоступна - прерываем переход
      if (!isOnline) {
        done(false);

        // Если сеть доступна - проверяем токен
      } else {
        /* Если пользователь не авторизован
         * отправляем на страницу авторизации */
        if (!hasToken) {
          done(false);
          this._router.navigate('login');
        } else done();
      }
    };

    // Навигация по сайту
    this._router.on({
      '/': {
        // переадресация на страницу со счетами
        uses: () => this._router.navigate('account'),
        hooks: { before },
      },
      // если пользователь уже авторизован - отправляем на страницу со счетами
      '/login': () => {
        this._tokenCheck()
          ? this._router.navigate('account')
          : this._loadLogin();
      },
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
        uses: () => {
          this._logout();
          this._router.navigate('login');
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

  /**
   * Переход на другую страницу
   *
   *  @param {string} url Новый адрес
   */
  navigate(url) {
    this._router.navigate(url);
  }
}
