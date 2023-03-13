import { el } from 'redom';
import Chart from 'chart.js/auto';

export default class AccountChart {
  type;
  account;
  balance;
  transactions;
  columnsCount = 12;
  chart;
  data;
  container;

  constructor({ account, balance, transactions }, type = 'dynamics') {
    this.account = account;
    this.balance = balance;
    this.transactions = transactions;
    this.type = type;
    this.container = el('canvas#acquisitions');

    this.data = this.transactionsToChartData();
    const canvas = this.container;
    switch (type) {
      case 'dynamics':
        this.columnsCount = 6;
        this.chart = this.drawChart(
          canvas,
          this.getLastDataItems(this.columnsCount),
          false
        );
        break;
      case 'ratio':
        this.chart = this.drawChart(
          canvas,
          this.getLastDataItems(this.columnsCount),
          true
        );
        break;
    }

    // this.container.addEventListener('click', () => {
    //   this.columnsCount = 10;
    //   this.chart.destroy();
    //   this.chart = this.drawChart(
    //     this.container,
    //     this.getLastDataItems(),
    //     this.type !== 'dynamics'
    //   );
    // });
  }
  redraw() {
    this.columnsCount = this.columnsCount === 12 ? 6 : 12;
    this.chart.destroy();
    this.chart = this.drawChart(
      this.container,
      this.getLastDataItems(),
      this.type !== 'dynamics'
    );
  }
  render() {
    return this.container;
  }

  drawChart(cavas, data, stacked = false) {
    let min, med, max;

    if (stacked) {
      console.log('stacked!');
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
      // отметка Min на графике - минимальная динамик
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

    // Плагин, рисует рамку
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
                backgroundColor: '#FD4E5D',
                data: data.map((row) => row.out),
              },
              {
                color: '#000',
                borderColor: '#0000ff',
                backgroundColor: '#76CA66',
                data: data.map((row) => row.in),
              },
            ]
          : [
              {
                color: '#000',
                borderColor: '#0000ff',
                backgroundColor: '#116ACC',
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

  transactionsToChartData() {
    const newarray = this.transactions.map((el) => ({
      // если отправитель не равен текущему счёту > входящий
      in: el.from !== this.account ? el.amount : 0,

      // если отправитель равен текущему счёту > исходящий
      out: el.from === this.account ? el.amount : 0,

      // динамика счёта: пополнение - положительная, перевод - отрицательная
      dinamic: el.from !== this.account ? el.amount : -el.amount,

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
    const obj2 = [];
    for (let prop in holder) {
      obj2.push({
        period: prop.slice(0, 3),
        dinamic: holder[prop].dinamic,
        in: holder[prop].in,
        out: holder[prop].out,
      });
    }
    return obj2;
  }

  /** Возвращает количество последних элементов, указанное в columnsCount */
  getLastDataItems() {
    const result = this.data.slice(-this.columnsCount);
    console.log('[getLastItems] result:', result);
    return result;
  }
}
