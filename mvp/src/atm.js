import { el, mount } from 'redom';
import * as ymaps from 'ymaps';

export default class Atm extends EventTarget {
  /** @type {HTMLElement} */
  container;

  #banks;

  map;

  /**
   * @callback onMapLoadedCallback
   * @type {onMapLoadedCallback}
   */
  onMapLoaded;

  /**
   * Конструктор
   * @param {onMapLoadedCallback} onMapLoaded
   */
  constructor(onMapLoaded = null) {
    super();
    this.container = el('.atm', [
      el('h1.atm__title', 'Карта банкоматов'),
      el('#map'),
    ]);

    ymaps.ready(() => {
      this.#createMap();
      if (onMapLoaded) onMapLoaded();
    });
    //this.#createMap();
  }

  get banks() {
    return this.#banks;
  }
  set banks(banks) {
    this.#banks = banks;
  }

  static ready() {
    ymaps.ready();
  }
  #createMap() {
    // Создание карты.
    this.map = new ymaps.Map('map', {
      center: [55.76, 37.64],
      zoom: 10,
    });
    this.dispatchEvent(new Event('mapLoaded'));
  }
  setMapPoint(lat, lon) {
    if (this.map) {
      const placemark = new ymaps.Placemark(
        [lat, lon],
        {},
        {
          // Задаем стиль метки (метка в виде круга).
          preset: 'islands#blueCircleDotIcon',
        }
      );
      // Размещение геообъекта на карте.
      this.map.geoObjects.add(placemark);
    }
  }
  centerMap() {
    this.map.setBounds(this.map.geoObjects.getBounds());
  }
  render() {
    return this.container;
  }
}
