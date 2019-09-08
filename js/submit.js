'use strict';

(function () {
  var utils = window.utils;
  var form = window.form;
  var pin = window.pin;
  var backend = window.backend;

  /**
   * Обработчик клика по popup.
   *
   */
  var onPopupClick = function () {
    closeSuccessPopup();
  };

  /**
   * Обработчик нажатия клаваиши ESC.
   *
   * @param {Object} evt - объект события DOM
   */
  var onEscPress = function (evt) {
    if (evt.keyCode === utils.key.ESC) {
      closeSuccessPopup();
    }
  };

  /**
   * Удаляет popup из DOM.
   *
   */
  var closeSuccessPopup = function () {
    var successMessageElement = utils.nodeMain.querySelector('.success');
    utils.nodeMain.removeChild(successMessageElement);

    window.removeEventListener('keydown', onEscPress);
  };

  /**
   * Добавляет popup в DOM при успешной отправке формы.
   *
   */
  var showSuccessPopup = function () {
    var successElement = utils.nodesTemplate.SUCCESS.cloneNode(true);
    successElement.tabIndex = 1;
    var fragment = document.createDocumentFragment(successElement);
    fragment.appendChild(successElement);
    utils.nodeMain.appendChild(fragment);
    var successPopupElement = utils.nodeMain.querySelector('.success');
    successPopupElement.focus();


    successPopupElement.addEventListener('click', onPopupClick);
    window.addEventListener('keydown', onEscPress);
  };

  /**
   * Сбрасывает страницу в исходное состояние и показывает сообщение после отправки формы.
   *
   */
  var resetPage = function () {
    pin.clear();
    form.reset();
    showSuccessPopup();
  };

  utils.nodeFormAd.addEventListener('submit', function (evt) {
    var formData = new FormData(utils.nodeFormAd);
    if (utils.nodeFormAd.checkValidity()) {
      evt.preventDefault();
      backend.publish(resetPage, utils.error, formData);
    }
  });
})();
