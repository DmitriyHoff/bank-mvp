import { el } from 'redom';
import * as ymaps from 'ymaps';
import Component from '../components/component';

export default class Atm extends Component {
  /**
   * Точка с расположением банка
   *
   * @typedef BankPosition
   * @type {object}
   * @property {number} lat Широта
   * @property {number} lon Долгота
   */

  /** @type {BankPosition[]} */
  _banks;

  // /** @type {ymaps.Map} */
  _map;

  /**
   * @callback mapLoadedCallback
   * @type {mapLoadedCallback}
   */
  onMapLoaded;

  /**
   * Конструктор
   *
   * @param {mapLoadedCallback} onMapLoaded
   */
  constructor(onMapLoaded = null) {
    super();
    this._container = el('.atm', [
      el('h1.page-title atm__title', 'Карта банкоматов'),
      el('.map__wrapper', el('#map')),
    ]);

    ymaps.ready(() => {
      this.createMap();
      if (onMapLoaded) onMapLoaded();
    });
  }

  /**
    @returns {BankPosition[]} Расположение банков на карте
   */
  get banks() {
    return this._banks;
  }

  /** @param {BankPosition[]} banks */
  set banks(banks) {
    this._banks = banks;
  }

  static ready() {
    ymaps.ready();
  }
  /** Инициализирует новую карту */
  createMap() {
    console.log(this._container);
    this._map = new ymaps.Map('map', {
      center: [55.76, 37.64],
      zoom: 10,
      controls: ['zoomControl', 'fullscreenControl'],
    });

    this.dispatchEvent(new Event('mapLoaded'));
  }
  /**
   * Добавляет точку на карту
   *
   * @param lat
   * @param lon
   */
  setMapPoint(lat, lon) {
    if (this._map) {
      const placemark = new ymaps.Placemark(
        [lat, lon],
        {},
        {
          // Задаем стиль метки (метка в виде круга).
          preset: 'islands#blueCircleDotIcon',
        }
      );
      // Размещение геообъекта на карте.
      this._map.geoObjects.add(placemark);
    }
  }
  /** Устаналивает границы карты, чтоб уместить все точки */
  centerMap() {
    this._map.setBounds(this._map.geoObjects.getBounds());
  }
}
