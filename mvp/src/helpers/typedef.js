/**
 * @typedef Transaction
 * @type {object}
 * @property {number} amount
 * @property {Date} date
 * @property {string} from
 * @property {string} to
 */

/**
 * Информация о счёте
 *
 * @typedef Account
 * @type {object}
 * @property {string} account
 * @property {number} balance
 * @property {Transaction[]} transactions
 */

/**
 * @typedef RateChange
 * @type {object}
 * @property {string} from Код валюты, из которой производится конвертирование
 * @property {string} to Код валюты, в которую производится конвертирование
 * @property {number} rate  Курс обмена валют
 * @property {number} change изменение курса по отношению к предыдущему значению:
 * `1` - возрастание курса, `-1` - убывание курса, `0` - курс не изменился.
 */
/**
 * @typedef TransferFund
 * @type {object}
 * @property {string }from Cчёт с которого списываются средства
 * @property {string} to Cчёт, на который зачисляются средства
 * @property {number} amount Cумма для перевода
 */
/**
 * @callback clickCallback
 * @param {Event} e
 */

/**
 * @callback transactionCallback
 * @param {TransferFund} fund
 */
/**
 * @callback networkCheckCallback
 * @callback tokenCheckCallback
 * @callback pageLoaderCallback
 * @callback pageReadyCallback
 * @callback pageLeaveCallback
 */

/**
 * @typedef RouterParams
 * @type {object}
 * @property {tokenCheckCallback} networkCheck
 * Функция, которая будет проверять соединение
 * @property {tokenCheckCallback} tokenCheck
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
 */
export const Type = {};
