import './style.css';

import { el, mount } from 'redom';
import Navigo from 'navigo';
import Header from './header';
import LoginBox from './login-box';
import Atm from './atm';
import ServerAPI from './serverApi';
import AccountsList from './accounts-page';
import CurrencyPage from './currency-page';
import RateChange from './rate-change';
import CurrenciesRate from './currencies-rate';
import AccountInfoPage from './account-info-page';

const server = new ServerAPI();
const header = new Header();
if (server.isOnline) header.addNavbar();
mount(window.document.body, header.html);

const main = el('main');
mount(window.document.body, main);

const currencyRate = new CurrenciesRate();

// | Обработчики событий WebSocket
const websocketHandlers = {
  onOpen: () => {
    console.log('[open] Connection established');
  },
  onClose: (event) => {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log('[close] Connection died');
    }
  },
  onMessage: (event) => {
    const message = JSON.parse(event.data);

    const rate = new RateChange(
      message.from,
      message.to,
      message.rate,
      message.change
    );
    currencyRate.pushRate(rate);
  },
  onError: (error) => {
    console.log(error.message);
  },
};

const router = new Navigo('/', { linksSelector: 'a' });

const before = (done, match) => {
  console.log('[router] before: ', server.isOnline);
  if (!server.isOnline) {
    done(false);
    router.navigate('login');
  } else {
    done();
  }
  console.log(match);
};
// Навигация по сайту
router.on({
  '/': {
    uses: () => router.navigate('account'),
    hooks: { before: before },
  },
  '/login': () => {
    document.title = 'Главная';
    const loginBox = new LoginBox(onLogin);
    main.replaceChildren(loginBox.html);
  },
  '/account/:id': {
    uses: (params) => setAccountInfoPage(params),
    before: before,
  },
  '/account': {
    uses: () => setUserAccountPage(),
    before: before,
  },

  '/currency': {
    uses: () => {
      console.log('[router]: Page handled');
      setCurrencyPage();
    },
    hooks: {
      before: before,
      // Обработка дополнительных событий
      // для включения/отключения сокета
      after: () => {
        if (server.isOnline) {
          // получаем сообщения от сервера
          server.feedCurrency(websocketHandlers);
        }
        console.log('[router]: Page ready');
      },
      leave: (done) => {
        // закрываем websocket
        server.feedCurrencyStop();
        console.log('[router]: Page leave');
        done();
      },
    },
  },
  '/atm': {
    uses: () => setAtmPage(),
    hooks: { before: before },
  },
  '/logout': {
    uses: () => {
      onLogout();
    },
    hooks: {
      after: () => {
        router.navigate('/login');
      },
    },
  },
});

router.notFound(() => {
  console.log('not found');
});
router.resolve();

/** Открывает страницу с банкоматами */
function setAtmPage() {
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

  console.log('atm page');
}

/** Открывает страницу с валютами */
function setCurrencyPage() {
  document.title = 'Валютный обмен';
  const currencyPage = new CurrencyPage();
  server
    .getCurrencies()
    .then((data) => {
      const currencies = Object.values(data.payload);
      currencyPage.currencies = currencies;
      currencyPage.exchangeBox.userCurrencies = currencies.map((el) => el.code);
      currencyPage.exchangeBox.addSubmitHandler((e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Display the key/value pairs
        const obj = {};
        for (const pair of formData.entries()) {
          obj[pair[0]] = pair[1];
        }
        console.log(obj);
        server.buyCurrency(obj);
      });
      currencyPage.setNewCurrencyRate(currencyRate);
    })
    .then(() => {
      server.getAllCurrencies().then((data) => {
        console.log(data.payload);
        currencyPage.exchangeBox.avaliableCurrencies = data.payload;
      });
    });
  main.replaceChildren(currencyPage.html);
  router.updatePageLinks();
  console.log('currency page');
}

function setAccountInfoPage(p) {
  const account = p.data.id;
  document.title = `Счёт #${account}`;

  server.getAccount(account).then((data) => {
    const accountInfo = new AccountInfoPage(data.payload);
    main.replaceChildren(accountInfo.html);
    router.updatePageLinks();
  });
}
/** Открывает страницу пользователя со счетами */
function setUserAccountPage() {
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
    router.updatePageLinks();
  });
  main.replaceChildren(accountsList.html);
}

/**  */
function onLogout() {
  server.logout();
  header.removeNavbar();
}

/** */
function onLogin({ event, login, password }) {
  //server.login('developer', 'skillbox').then((response) => {
  server.login(login, password).then((response) => {
    if (response?.error) {
      console.log(response.error);
    }
    if (server.isOnline) {
      router.navigate('/account');
      header.addNavbar();
      router.updatePageLinks();
    }
  });
}
