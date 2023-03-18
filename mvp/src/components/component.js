/**
 * Абстрактный класс компонентов
 *
 * @module Component
 * @augments EventTarget
  @abstract */
export default class Component extends EventTarget {
  /**
   * HTML-разметка компонента
   *
   * @protected
    @type {HTMLElement} */
  _container;
  /**
   * Экземляр объекта Component создать нельзя
   *
   * @class Component
   * @abstract
   */
  constructor() {
    if (new.target === Component) {
      throw new Error('You cannot instantiate an abstract class.');
    }
    super();
  }
  /**
   * HTML-разметка компонента
   *
   * @type {HTMLElement}
   */
  get html() {
    return this._container;
  }
}
