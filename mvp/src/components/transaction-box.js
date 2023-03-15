import { el } from 'redom';
import Component from './component';

export default class TransactionBox extends Component {
  constructor() {
    super();
    this._container = el('.accounts__transaction-box');
  }
}
