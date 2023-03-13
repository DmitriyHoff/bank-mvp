import { el } from 'redom';

export default class NewTransactionBox {
  container;

  constructor() {
    this.container = el('.accounts__transaction-box');
  }
  get html() {
    return this.container;
  }
}
