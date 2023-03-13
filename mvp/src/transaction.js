export default class Transaction {
  /** @type {number} */
  amount;

  /** @type {Date} */
  date;

  /** @type {string} */
  source;

  /** @type {string} */
  destination;

  constructor({ amount, date, from, to }) {
    this.amount = amount;
    this.date = new Date(date);
    this.source = from;
    this.destination = to;
  }
}
