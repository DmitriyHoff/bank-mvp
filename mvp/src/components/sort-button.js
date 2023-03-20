import { el } from 'redom';
import Component from './component';
/* <div class="custom-select" tabindex="0">
  <select name="categories">
    <option value="0">Сортировка</option>
    <option value="1">По номеру</option>
    <option value="2">По балансу</option>
    <option value="2">По последней транзакции</option>
  </select>
  <div class="custom-select--selected">Сортировка</div>
    <div class="custom-select__items custom-select--hide">
      <div>По номеру</div>
      <div>По балансу</div>
      <div>По последней транзакции</div>
  </div>
</div> */

/**
 * Представляем кнопку сортировки со списком опций
 */
export default class SortButton extends Component {
  /** @type {HTMLSelectElement} */
  _select;

  /** @type {HTMLSelectElement[]} */
  _customItems;

  /** @type {string} */
  _title = 'сортировка';

  /** @type {boolean} */
  _asc = true;

  /** @type {string} */
  _sort;

  _onSortChange;

  constructor(onSort) {
    super();
    this._onSortChange = onSort;
    this._select = el('select', { name: 'sort' }, [
      el('option', { value: '' }, `${this._title}`),
      el('option', { value: 'by-number' }, 'По номеру'),
      el('option', { value: 'by-balance' }, 'По балансу'),
      el('option', { value: 'by-transaction' }, 'По последней транзакции'),
    ]);

    this._container = el('.custom-select', { tabIndex: '0' }, [this._select]);
    this.init();
  }
  static closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x,
      y,
      arrNo = [];
    x = this._container.getElementsByClassName('custom-select__items');
    y = this._container.getElementsByClassName('custom-select--selected');
    for (let i = 0; i < y.length; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('--arrow-active');
      }
    }
    for (let i = 0; i < x.length; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('custom-select--hide');
      }
    }
  }

  init() {
    const selectedItem = el(
      'div.custom-select--selected',
      `${this._select.options[this._select.selectedIndex].text}`
    );

    this._container.appendChild(selectedItem);

    const customSelectItems = el(
      'div.custom-select__items custom-select--hide'
    );

    // Для каждой опции из списка, кроме первой создаём элемент списка
    for (let index = 1; index < this._select.length; index++) {
      const customOption = el('div', `${this._select.options[index].text}`);

      customOption.addEventListener('click', (e) => {
        const header = e.target.parentNode.previousSibling;
        this._container.focus();

        for (let i = 0; i < this._select.length; i++) {
          if (this._select.options[i].innerHTML === e.target.innerHTML) {
            // устанавливаем тип сортировки
            const asc = this._select.selectedIndex !== i || !this._asc;
            this.setSortType(this._select.options[i].value, asc);
            this._select.selectedIndex = i;

            header.innerHTML = e.target.innerHTML;
            const sameAsSelectedElements =
              e.target.parentNode.querySelectorAll('.same-as-selected');

            for (let i = 0; i < sameAsSelectedElements.length; i++) {
              sameAsSelectedElements[i].removeAttribute('class');
            }
            e.target.setAttribute('class', 'same-as-selected');
            break;
          }
        }
        header.click();
      });
      customSelectItems.appendChild(customOption);

      this._container.appendChild(customSelectItems);
      selectedItem.addEventListener('click', (e) => {
        e.stopPropagation();
        e.target.nextSibling.classList.toggle('custom-select--hide');
        this._container.classList.toggle('--arrow-active');
      });
    }
  }

  /**
   * Изменяет тип сортировки и вызывает callback-функцию
   *
   * @param {string} type Поле по которому будет производиться сортировка
   * @param {boolean} asc По возрастанию/убыванию
   */
  setSortType(type, asc) {
    if (type && type.length > 0) {
      this._sort = type;
      this._asc = asc;
      this._onSortChange(type, asc);
    }
    const selected = this._container.querySelector('.custom-select--selected');
    if (selected) {
      selected.classList.toggle('sort--desc', this._asc);
    }
  }
}
