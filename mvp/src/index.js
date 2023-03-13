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

const header = new Header();
header.addNavbar();
mount(window.document.body, header.html);
const main = el('main');
mount(window.document.body, main);

const server = new ServerAPI();
const currencyRate = new CurrenciesRate();
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
    // console.log(`[message] Data received from server: ${event.data}`);
    // console.log('from', message);
    const rate = new RateChange(
      message.from,
      message.to,
      message.rate,
      message.change
    );
    // console.log(rate);
    currencyRate.pushRate(rate);
  },
  onError: (error) => {
    console.log(error.message);
  },
};
const logging = server.login('developer', 'skillbox').then(() => {
  // server.getAccounts();
  // 74213041477477406320783754
  //server.getAccount('74213041477477406320783754');
  //server.createAccount();
  server.getCurrencies();
  server.getBanks();

  server.getAllCurrencies();
});

const router = new Navigo('/');

router.on({
  '/': () => {
    document.title = 'Главная';
    const loginBox = new LoginBox();
    main.replaceChildren(loginBox.html);
  },
  '/login': () => {
    document.title = 'Вход';
    main.replaceChildren();
    console.log('login page');
  },
  '/account/:id': (p) => setAccountInfoPage(p),
  '/account': () => setUserAccountPage(),

  '/currency': {
    uses: () => {
      console.log('[router]: Page handled');
      setCurrencyPage();
    },
    hooks: {
      // Обработка дополнительных событий
      // для включения/отключения сокета
      after: () => {
        logging.then(() => {
          // получаем сообщения от сервера
          server.feedCurrency(websocketHandlers);
        });
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
  '/atm': () => setAtmPage(),
  '/logout': () => {
    onLogout();
    router.navigate('/');
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
  logging.then(() => {
    server
      .getCurrencies()
      .then((data) => {
        const currencies = Object.values(data.payload);
        currencyPage.currencies = currencies;
        currencyPage.exchangeBox.userCurrencies = currencies.map(
          (el) => el.code
        );
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
  });
  main.replaceChildren(currencyPage.html);
  console.log('currency page');
}

function setAccountInfoPage(p) {
  const account = p.data.id;
  document.title = `Счёт #${account}`;

  logging.then(() => {
    server.getAccount(account).then((data) => {
      const accountInfo = new AccountInfoPage(data.payload);
      main.replaceChildren(accountInfo.html);
    });
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
  logging.then(() => {
    server.getAccounts().then((data) => {
      const accounts = data.payload;
      console.log('accounts', accounts);
      if (accounts)
        accounts.forEach((acc) => {
          accountsList.addAccountToList(acc);
        });
    });
    main.replaceChildren(accountsList.html);
  });

  console.log('account page');
}

/**  */
function onLogout() {
  main.replaceChildren();
  header.removeNavbar();
}
