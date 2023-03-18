// eslint-disable-next-line no-unused-vars
import * as Type from '../helpers/typedef';
import { el } from 'redom';
import Chart from 'chart.js/auto';
import Component from './component';
/**
 * @typedef {Type.Account} Account
 * @typedef {Type.Transaction} Transaction
 * @typedef ChartItem
 * @type {object}
 * @property {string} period Месяц
 * @property {number} in Сумма входящих платежей
 * @property {number} out Сумма исходящих платежей
 */

/** @constant */
const COLOR_RED = '#FD4E5D';

/** @constant */
const COLOR_BLUE = '#116ACC';

/** @constant */
const COLOR_GREEN = '#76CA66';

/**
 * Представляет компонет с графиком
 *
 * @module AccountChart
 * @augments Component
 */
export default class AccountChart extends Component {
  /**
   * Тип графика `dynamics` или `ratio`
   *
   * @protected
    @type {string} */
  _type;

  /**
   * Идентификатор счёта
   *
   * @protected
    @type {string} */
  _account;

  /**
   * Баланс
   *
   * @protected
    @type {number} */
  _balance;

  /**
   * Список транзакций
   *
   * @protected
    @type {Transaction[]} */
  _transactions;

  /**
   * Количество отображаемых колонок
   *
   * @protected
    @type {number} */
  _columnsCount = 12;

  /**
   * График
   *
   * @protected
    @type {Chart} */
  _chart;

  /**
   * Отображаемые данные
   *
   * @protected
    @type {ChartItem[]} */
  _data;

  /**
   * Создаёт экземпляр `AccountChart`
   *
   * @param {Account} account Объект счёта пользователя
   * @param {string} type Тип графика: `dynamics` или `ratio`
   * @param {number} columnsCount Количество отображаемых колонок
   * @class AccountChart
   */
  constructor(account, type = 'dynamics', columnsCount = 12) {
    super();
    this._account = account.account;
    this._balance = account.balance;
    this._transactions = account.transactions;
    this._type = type;
    this._container = el('canvas#acquisitions');

    this._data = this.transactionsToChartData();
    const canvas = this._container;
    switch (type) {
      case 'dynamics':
        this._columnsCount = columnsCount;
        this._chart = this.drawChart(
          canvas,
          this.getLastDataItems(this._columnsCount),
          false
        );
        break;
      case 'ratio':
        this._chart = this.drawChart(
          canvas,
          this.getLastDataItems(this._columnsCount),
          true
        );
        break;
    }
  }

  /**
   * Создаёт объект графика
   *
   * @param {HTMLCanvasElement} cavas Элемент `HTMLCanvasElement` на котором будет отрисован график
   * @param {ChartItem[]} data Массив объектов `ChartItem` для отображения на графике
   * @param {boolean} stacked Если `true` будет построен график в виде стопок.
   * @returns {Chart} График `Chart`
   */
  drawChart(cavas, data, stacked = false) {
    let min, med, max;

    if (stacked) {
      min = 0;

      // отметка Max на графике
      max = data.reduce(
        (accumulator, currentValue) =>
          Math.max(accumulator, currentValue.in + currentValue.out),
        0
      );

      // промежуточная отметка
      med = data.reduce(
        (accumulator, currentValue) => Math.max(accumulator, currentValue.out),
        0
      );
    } else {
      // отметка Min на графике - минимальная динамика
      min = data.reduce(
        (accumulator, currentValue) =>
          Math.min(accumulator, currentValue.dinamic),
        0
      );
      // отметка Max на графике - максимальная динамика
      max = data.reduce(
        (accumulator, currentValue) =>
          Math.max(accumulator, currentValue.dinamic),
        0
      );
    }

    Chart.defaults.font.family = "'Work Sans', sans-serif";
    Chart.defaults.font.size = 20;
    Chart.defaults.font.lineHeight = 1.15;
    Chart.defaults.font.weight = 'bold';
    Chart.defaults.color = 'black';

    // Плагин, рисует рамку графика
    const customBorder = {
      id: 'customBorder',
      beforeDatasetDraw: (charts) => {
        const {
          ctx,
          chartArea: { top, bottom, left, right },
        } = charts;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';

        let t = parseInt(top) - 0.5;
        let l = parseInt(left);
        let r = parseInt(right) - 0.5;
        let b = parseInt(bottom) - 0.5;

        ctx.moveTo(l, t);
        ctx.lineTo(r, t);
        ctx.lineTo(r, b);
        ctx.lineTo(l, b);
        ctx.closePath();
        ctx.stroke();
      },
    };

    const params = {
      type: 'bar',

      data: {
        borderColor: '#000',
        borderWidth: 3,
        labels: data.map((row) => row.period.split(' ')[0]),
        datasets: stacked
          ? [
              {
                color: '#000',
                borderColor: '#0000ff',
                backgroundColor: COLOR_RED,
                data: data.map((row) => row.out),
              },
              {
                color: '#000',
                borderColor: '#0000ff',
                backgroundColor: COLOR_GREEN,
                data: data.map((row) => row.in),
              },
            ]
          : [
              {
                color: '#000',
                borderColor: '#0000ff',
                backgroundColor: COLOR_BLUE,
                data: data.map((row) => row.dinamic),
              },
            ],
      },
      options: {
        layout: {
          padding: 0,
        },
        animation: true,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          beforeInit: customBorder,
          tooltip: { enabled: false },
          title: {
            display: true,
            text: stacked
              ? 'Соотношение входящих исходящих транзакций'
              : 'Динамика баланса',
            align: 'start',
            padding: {
              top: 0,
              right: 0,
              bottom: 25,
            },
          },
          legend: { display: false },
        },
        scales: {
          y: {
            offset: false,
            border: {
              display: false,
            },
            //drawBorder: false,
            grid: {
              display: true,
              padding: 0,
              drawTicks: true,
            },
            position: 'right',
            ticks: {
              padding: 24,
              stepSize: max / 300,
              autoskip: false,
              font: { weight: '500' },
            },
            afterBuildTicks: (axis) => {
              const ticks = {
                min,
                // добавляем среднюю точку, если она инициализирована
                ...(med ? { med } : {}),
                max,
              };
              min = ticks.min;
              max = ticks.max;
              const ticksArray = Object.values(ticks);

              axis.ticks = ticksArray.map((v) => ({ value: Math.round(v) }));
            },
            stacked: true,
          },
          x: {
            border: {
              display: false,
            },
            grid: { display: false },
            stacked: true,
            ticks: {
              backdropPadding: {
                x: 0,
                y: 0,
              },
            },
          },
        },
      },
      plugins: [customBorder],
    };

    return new Chart(cavas, params);
  }

  /**
   * Преобразует все транзакции в массив данных для графика
   *
   * @returns {ChartItem[]} Массив объектов для отображения в графике
   */
  transactionsToChartData() {
    const newarray = this._transactions.map((el) => ({
      // если отправитель не равен текущему счёту > входящий
      in: el.from !== this._account ? el.amount : 0,

      // если отправитель равен текущему счёту > исходящий
      out: el.from === this._account ? el.amount : 0,

      // динамика счёта: пополнение - положительная, перевод - отрицательная
      dinamic: el.from !== this._account ? el.amount : -el.amount,

      // дата в виде "месяц_yyyy"
      date: new Date(el.date).toLocaleDateString('ru-Ru', {
        year: 'numeric',
        month: 'long',
      }),
    }));

    // создаём массив объектов, где ключ - дата
    const holder = {};
    newarray.forEach(function (d) {
      if (Object.prototype.hasOwnProperty.call(holder, d.date)) {
        holder[d.date].dinamic += d.dinamic;
        holder[d.date].in += d.in;
        holder[d.date].out += d.out;
      } else {
        holder[d.date] = {
          dinamic: d.dinamic,
          in: d.in,
          out: d.out,
        };
      }
    });

    // формируем новый массив объектов в удобном формате
    const chartItems = [];
    for (let prop in holder) {
      chartItems.push({
        period: prop.slice(0, 3),
        dinamic: holder[prop].dinamic,
        in: holder[prop].in,
        out: holder[prop].out,
      });
    }
    return chartItems;
  }

  /**
   * @returns {ChartItem[]} Возвращает заданное при инициализации количество элементов ChartItem
   */
  getLastDataItems() {
    return this._data.slice(-this._columnsCount);
  }
}
