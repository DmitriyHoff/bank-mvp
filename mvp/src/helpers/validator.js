export default class Validator {
  /**
   * Ругурярное выражение для проверки чисел
   *
   * @constant {RegExp}
   * @static
   */
  static REGEX_FLOAT = /^(\d|[1-9]+\d*|0\.\d+|[1-9]+\d*\.\d+)$/;

  /**
   * Проверяет на корректность поле ввода суммы перевода
   *
   * @param {HTMLInputElement} amountInput Текстовое поле для валидации
   * @returns {boolean} Указывает на наличие ошибок
   */
  static checkAmount(amountInput) {
    const amount = amountInput.value;
    const minLength = amount.length > 0;
    const floatTest = Validator.REGEX_FLOAT.test(amount);
    let hasError = false;
    if (!minLength) {
      Validator.setErrorText(amountInput, '');
      hasError = true;
    } else if (!floatTest) {
      Validator.setErrorText(amountInput, 'Некорректное число');
      hasError = true;
    } else {
      Validator.setErrorText(amountInput, '');
    }

    return hasError;
  }

  /**
   * Устанавливает или убирает красную рамку с текстового поля
   *
   * @param {HTMLInputElement} input Элемент, к которому будет применена рамка
   * @param {boolean} warning Состояние рамки. Если `false` рамка будет скрыта
   */
  static setWarningFrame(input, warning = true) {
    input.classList.toggle('input--warning', warning);
  }

  /**
   * Устанавливает текст с ошибкой
   *
   * @param {HTMLInputElement|string} input Текстовое поле или его название
   * @param {string} text Текст сообщения об ошибке
   */
  static setErrorText(input, text) {
    input.parentElement.firstElementChild.innerHTML = text;
    Validator.setWarningFrame(input, text !== '' || null);
  }
}
