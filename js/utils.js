'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  var mainElement = document.querySelector('main');

  var mapElement = mainElement.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mainPinElement = mapPinsElement.querySelector('.map__pin--main');

  var filtersContainerElement = mapElement.querySelector('.map__filters-container');
  var mapFiltersElement = filtersContainerElement.querySelector('.map__filters');
  var mapFilterFieldsetElement = mapFiltersElement.querySelector('fieldset');
  var mapFiltersCollection = mapFiltersElement.querySelectorAll('.map__filter');
  var formAdElement = mainElement.querySelector('.ad-form');
  var formAdFieldsetsElement = formAdElement.querySelectorAll('fieldset');

  var Template = {
    PIN: document.querySelector('#pin').content.querySelector('.map__pin'),
    ERROR: document.querySelector('#error').content.querySelector('.error'),
    CARD: document.querySelector('#card').content.querySelector('.map__card'),
    SUCCESS: document.querySelector('#success').content.querySelector('.success')
  };

  /**
   * Показывает окно с ошибкой при ошибке загрузки данных с сервера.
   */
  var onRequestErrorShowPopup = function () {
    var error = Template.ERROR.cloneNode(true);
    mainElement.appendChild(error);
    var errorMessage = mainElement.querySelector('.error');
    var btnCloseError = errorMessage.querySelector('.error__button');

    /**
     * Обработчик клика по popup.
     *
     * @param {Object} evt - объект события DOM
     */
    var onErrorPopupClick = function (evt) {
      if (evt.target === btnCloseError || evt.target === errorMessage) {
        closeErrorPopup();
      }
    };

    /**
     * Обработчик нажатия клаваиши ESC.
     *
     * @param {Object} evt - объект события DOM
     */
    var onEscPress = function (evt) {
      if (evt.keyCode === KeyCode.ESC) {
        closeErrorPopup();
      }
    };

    /**
     * Удаляет popup из DOM.
     *
     */
    var closeErrorPopup = function () {
      mainElement.removeChild(errorMessage);
      window.removeEventListener('keydown', onEscPress);
      window.removeEventListener('click', onErrorPopupClick);
    };

    window.addEventListener('click', onErrorPopupClick);
    window.addEventListener('keydown', onEscPress);
  };

  window.utils = {
    key: KeyCode,
    error: onRequestErrorShowPopup,
    nodeMain: mainElement,
    nodeMap: mapElement,
    nodeMapPins: mapPinsElement,
    nodeMainPin: mainPinElement,
    nodeFiltersContainer: filtersContainerElement,
    nodeFormMapFilters: mapFiltersElement,
    nodeMapFiterFieldset: mapFilterFieldsetElement,
    nodeMapFilters: mapFiltersCollection,
    nodeFormAd: formAdElement,
    nodeFormAdFieldsets: formAdFieldsetsElement,
    nodesTemplate: Template
  };
})();
