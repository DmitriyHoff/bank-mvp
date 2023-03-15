import './styles/style.css';

import { el, mount } from 'redom';
import PageHeader from './components/page-header';
import LoginBox from './components/login-box.js';
import Atm from './pages/atm';
import ServerAPI from './serverApi';
import AccountsList from './pages/accounts';
import CurrencyPage from './pages/currency';
import RateChange from './components/rate-change';
import CurrenciesRate from './components/currencies-rate';
import AccountInfoPage from './pages/account-info';
import Router from './components/router';
import AccountHistoryPage from './pages/history';

/** Формирует страницу с банкоматами */
function atmPageLoader() {
  document.title = 'Банкоматы';
  main.replaceChildren();

  const atm = new Atm(() => {
    server.getBanks().then((data) => {
      data.forEach((point) => {
        atm.setMapPoint(point.lat, point.lon);
      });
      atm.centerMap();
    });
  });

  main.replaceChildren(atm.html);
}

/** Формирует страницу с валютами */
function currencyPageLoader() {
  document.title = 'Валютный обмен';
  const currencyPage = new CurrencyPage();
  server
    // Загружаем валюты пользователя
    .getCurrencies()
    .then((data) => {
      const currencies = Object.values(data.payload);
      // вписываем в соответствующий компонент
      currencyPage.currencies = currencies;

      // передаём коды валют в форму обмена
      currencyPage._exchangeBox.userCurrencies = currencies.map(
        (el) => el.code
      );

      // Добавляем обработчик `submit` для формы обмена валют
      currencyPage._exchangeBox.addSubmitHandler((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const obj = {};
        for (const pair of formData.entries()) {
          obj[pair[0]] = pair[1];
        }
        console.log(obj);
        // отправляем сообщение на сервер
        server.buyCurrency(obj).then((data) => {
          // if error...

          // Ответ передаём в компонент валют пользователя
          currencyPage._userCurrencies.currencies = Object.values(data.payload);
        });
      });
      currencyPage.setNewCurrencyRate(currencyRate);
    })
    .then(() => {
      server.getAllCurrencies().then((data) => {
        console.log(data.payload);
        currencyPage._exchangeBox.avaliableCurrencies = data.payload;
      });
    });
  main.replaceChildren(currencyPage.html);
  router.update();
  console.log('currency page');
}

/** Формирует страницу с информацией о счёте
 * @param {*} params
 */
function accountInfoPageLoader(params) {
  const account = params.data.id;
  document.title = `Просмотр счёта`;

  server.getAccount(account).then((data) => {
    const accountInfo = new AccountInfoPage(data.payload, () => {
      console.log('it works!');
      router.navigate(`history/${data.payload.account}`);
    });
    main.replaceChildren(accountInfo.html);
    router.update();
  });
}

/** Формирует страницу с информацией о счёте
 * @param {*} params
 */
function accountHistoryPageLoader(params) {
  const account = params.data.id;
  document.title = `История баланса`;
  console.log(document.title);
  server.getAccount(account).then((data) => {
    const accountHistory = new AccountHistoryPage(data.payload);
    main.replaceChildren(accountHistory.html);
    router.update();
  });
}

/** Открывает страницу пользователя со счетами */
function accountPageLoader() {
  document.title = 'Счета';

  const accountsList = new AccountsList(() => {
    server.createAccount().then((data) => {
      accountsList.addAccountToList(data.payload);
    });
  });

  server.getAccounts().then((data) => {
    const accounts = data.payload;
    console.log('accounts', accounts);
    if (accounts) {
      accounts.forEach((acc) => {
        accountsList.addAccountToList(acc);
      });
    }
    router.update();
  });
  main.replaceChildren(accountsList.html);
}

/** Формирует страницу авторизации*/
function loginPageLoader() {
  document.title = 'Главная';
  const loginBox = new LoginBox(onLogin);
  main.replaceChildren(loginBox.html);
}
/** Удаляет access_token */
function onLogout() {
  server.logout();
  header.removeNavbar();
}

/** Callback-функция вызывается событием `submit` формы авторизации */
function onLogin({ login, password }) {
  //server.login('developer', 'skillbox').then((response) => {
  server.login(login, password).then((response) => {
    if (response?.error) {
      console.log(response.error);
    }
    if (server.isOnline) {
      router.navigate('account');
      header.addNavbar();
      router.update();
    }
  });
}

const server = new ServerAPI();
const header = new PageHeader();

//если пользователь авторизовался - отображаем навигаю по сайту
if (server.isOnline) header.addNavbar();

// Добавляем <header> на страницу
mount(window.document.body, header.html);

// Добавляем <main> на страницу
const main = el('main');
mount(window.document.body, main);

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
  isOnline: () => server.isOnline,
  atmPageLoader,
  loginPageLoader,
  accountPageLoader,
  accountInfoPageLoader,
  accountHistoryPageLoader,
  currencyPageLoader,
  currencyPageReady: () => {
    if (server.isOnline) {
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
