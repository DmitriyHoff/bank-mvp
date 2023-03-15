/** Абстрактный класс компонентов
 * @abstract */
export default class Component extends EventTarget {
  /** @type {HTMLElement} */
  _container;
  constructor() {
    if (new.target === Component) {
      throw new Error('You cannot instantiate an abstract class.');
    }
    super();
  }
  /** HTML-разметка компонента */
  get html() {
    return this._container;
  }
}
