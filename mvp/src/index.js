/* Импорт CSS-стилей */
import './styles/style.css';

/** Импорт всех SVG-файлов */
function loadAllSvg() {
  // eslint-disable-next-line no-undef
  const context = require.context('./assets/', true, /\.svg$/);
  context.keys().forEach((file) => context(file));
}
loadAllSvg();

import { el, mount } from 'redom';
import PageHeader from './components/page-header';
import LoginBox from './components/login-box.js';
import Atm from './pages/atm';
import ServerAPI from './server-api';
import AccountsList from './pages/accounts';
import CurrencyPage from './pages/currency';
import RateChange from './components/rate-change';
import CurrenciesRate from './components/currencies-rate';
import AccountInfoPage from './pages/account-info';
import Router from './components/router';
import AccountHistoryPage from './pages/history';

/** Формирует страницу с банкоматами */
function atmPageLoader() {
  if (isOnline) {
    document.title = 'Банкоматы';

    if (isOnline) {
      main.replaceChildren();

      const atm = new Atm(async () => {
        const response = await server.getBanks();

        response.forEach((point) => {
          atm.setMapPoint(point.lat, point.lon);
        });
        atm.centerMap();
      });
      main.replaceChildren(atm.html);
    }
  }
}

/** Формирует страницу с валютами */
async function currencyPageLoader() {
  if (isOnline) {
    document.title = 'Валютный обмен';
    const currencyPage = new CurrencyPage();

    // Загружаем валюты пользователя
    const data = await server.getCurrencies();

    const currencies = Object.values(data.payload);
    // вписываем в соответствующий компонент
    currencyPage.currencies = currencies;

    // передаём коды валют в форму обмена
    currencyPage._exchangeBox.userCurrencies = currencies.map((el) => el.code);

    // Добавляем обработчик `submit` для формы обмена валют
    currencyPage._exchangeBox.addSubmitCallback((e) => {
      e.preventDefault();
      const formData = new FormData(e.target);

      const obj = {};
      for (const pair of formData.entries()) {
        obj[pair[0]] = pair[1];
      }

      // отправляем сообщение на сервер
      const response = server.buyCurrency(obj);

      // if error...

      // Ответ передаём в компонент валют пользователя
      currencyPage._userCurrencies.currencies = Object.values(response.payload);
    });
    currencyPage.setNewCurrencyRate(currencyRate);

    const currenciesData = await server.getAllCurrencies();

    console.log(data.payload);
    currencyPage._exchangeBox.avaliableCurrencies = currenciesData.payload;

    main.replaceChildren(currencyPage.html);
    router.update();
  }
}

/**
 * Формирует страницу с информацией о счёте
 *
 * @typedef {import('navigo').Match} Match
 * @param {Match} match Параметры адресной строки
 */
async function accountInfoPageLoader(match) {
  if (isOnline) {
    const account = match.data.id;
    document.title = `Просмотр счёта`;

    // Запрашиваем информацию о счёте
    const data = await server.getAccount(account);

    // Создаём объект страницы с информацией о счёте
    const accountInfo = new AccountInfoPage({
      account: data.payload,
      // передаём функцию-обработчик для перехода на страницу с подробным графиком
      chartsCallback: () => router.navigate(`history/${data.payload.account}`),

      // передаём функцию-обработчик для перевода средств на другой счёт
      transactionCallback: async (transactionBox, fund) => {
        const resp = await server.transferFunds(fund);
        if (resp.error === '') {
          accountInfo.updateInfo(resp.payload);
        } else {
          switch (resp.error) {
            case `Overdraft prevented`:
              transactionBox.setErrorText('amount', 'Недостаточно средств');
              break;
            case 'Invalid account to':
              transactionBox.setErrorText('dest', 'Счёт не найден');
              break;
            case `Invalid amount`:
              // эта строка вероятно никогда не появится
              transactionBox.setErrorText('amount', 'Неверная сумма перевода');
              break;
          }
        }
      },
    });
    main.replaceChildren(accountInfo.html);

    // обновляем ссылки navigo
    router.update();
  }
}

/**
 * Формирует страницу с информацией о счёте
 *
 * @typedef {import('navigo').Match} Match
 * @param {Match} params Параметры объекта навигации
 */
async function accountHistoryPageLoader(params) {
  if (isOnline) {
    const account = params.data.id;
    document.title = `История баланса`;

    const data = await server.getAccount(account);

    const accountHistory = new AccountHistoryPage({
      account: data.payload,
    });
    main.replaceChildren(accountHistory.html);

    // обновляем ссылки navigo
    router.update();
  }
}

/** Открывает страницу пользователя со счетами */
async function accountPageLoader() {
  if (isOnline) {
    document.title = 'Счета';

    // создаём список счетов
    const accountsList = new AccountsList(async () => {
      // в качестве Callback- создаём новый счёт
      const data = await server.createAccount();
      accountsList.addAccount(data.payload);
    });

    const data = await server.getAccounts();
    const accounts = data.payload;

    console.log('accounts: ', accounts);
    if (accounts) {
      accounts.forEach((acc) => {
        accountsList.addAccount(acc);
      });
    }

    main.replaceChildren(accountsList.html);

    // обновляем ссылки navigo
    router.update();
  }
}

/** Формирует страницу авторизации*/
function loginPageLoader() {
  document.title = 'Авторизация';
  const loginBox = new LoginBox(onLogin);
  main.replaceChildren(loginBox.html);
}

/** Удаляет access_token */
function onLogout() {
  header.removeNavbar();
  server.logout();
}

/**
 * Callback-функция вызывается событием `submit` формы авторизации
 *
 *  @typedef Auth
 *  @type {object}
 *  @property {string} login Логин
 *  @property {string} password Пароль
 *  @param {LoginBox} loginBox Компонент авторизации
 *  @param {Auth} auth Логин и пароль
 */
async function onLogin(loginBox, auth) {
  if (isOnline) {
    // Выполняем запрос авторизации на сервер
    const response = await server.login(auth.login, auth.password);

    if (response?.error) {
      const error = response.error;
      console.log('ERROR: ', error);
      if (error.includes('user')) loginBox.setInputError('user');
      if (error.includes('password')) loginBox.setInputError('password');
    }
    if (server.hasToken) {
      const delay = 600;
      new Promise(() => {
        setTimeout(() => {
          // Посвечиваем логин
          loginBox.setInputOK('user');
          new Promise(() => {
            setTimeout(() => {
              // затем поле пароля
              loginBox.setInputOK('password');
              new Promise(() => {
                setTimeout(() => {
                  // затем выполним переход
                  router.navigate('account');
                  header.addNavbar();
                  router.update();
                }, delay * 2);
              }, delay);
            }, delay);
          });
        }, delay);
      });
    }
  }
}

const server = new ServerAPI();
const header = new PageHeader();

// Получаем информацию о соединении
let isOnline = navigator.onLine;

//если пользователь авторизовался - отображаем навигаю по сайту
if (server.hasToken) header.addNavbar();

// Добавляем <header> на страницу
mount(window.document.body, header.html);

// Добавляем <main> на страницу
const main = el('main');
mount(window.document.body, main);

// Добавляем обработчики изменения сетевого статуса
window.addEventListener('online', () => {
  isOnline = true;
  header.setOfflineLabel(!isOnline);
});
window.addEventListener('offline', () => {
  isOnline = false;
  header.setOfflineLabel(!isOnline);
});

// Создаём компонет курса валют
const currencyRate = new CurrenciesRate();

// Обработчики событий WebSocket
const websocketHandlers = {
  onOpen: () => console.log('[websocket: open]'),
  onClose: () => console.log('[websocket: close]'),
  onMessage: (event) => {
    const message = JSON.parse(event.data);

    const rate = new RateChange({
      from: message.from,
      to: message.to,
      rate: message.rate,
      change: message.change,
    });
    currencyRate.pushRate(rate);
  },
  onError: (error) => console.log(error.message),
};

// И создаём маршрутизатор для страницы и передаём в него все обработчики
const router = new Router({
  networkCheck: () => isOnline,
  tokenCheck: () => server.hasToken,
  atmPageLoader,
  loginPageLoader,
  accountPageLoader,
  accountInfoPageLoader,
  accountHistoryPageLoader,
  currencyPageLoader,
  currencyPageReady: () => {
    if (server.hasToken) {
      // получаем сообщения от сервера
      server.feedCurrency(websocketHandlers);
    }
  },
  currencyPageLeave: () => {
    // закрываем websocket
    server.feedCurrencyStop();
  },
  logoutPageLoader: () => onLogout(),
});

router.resolve();
