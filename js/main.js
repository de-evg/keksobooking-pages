'use strict';

(function () {
  var utils = window.utils;
  var backend = window.backend;
  var isMapDisabled = true;

  /**
   * Переключает состояние фильтра disable/active.
   *
   * @param {boolean} toggle - переключатель disable(true)/active(false).
   */
  var isFilterDisabled = function (toggle) {
    utils.nodeMapFilters.forEach(function (filter) {
      filter.disabled = toggle;
    });
    utils.nodeMapFiterFieldset.disabled = toggle;
    if (toggle !== utils.nodeFormMapFilters.classList.contains('map__filters--disabled')) {
      utils.nodeFormMapFilters.classList.toggle('map__filters--disabled');
    }
  };

  /**
   * Переключает состояние формы disable/active.
   *
   * @param {boolean} toggle - переключатель disable(true)/active(false).
   */
  var isAdFormDisabled = function (toggle) {
    utils.nodeFormAdFieldsets.forEach(function (fieldset) {
      fieldset.disabled = toggle;
    });
    if (toggle !== utils.nodeFormAd.classList.contains('ad-form--disabled')) {
      utils.nodeFormAd.classList.toggle('ad-form--disabled');
    }
  };

  /**
   * Активирует фильтр, форму и показывает похожие объявления
   *
   * @param {function} onSuccess - функция обработки успешного получения данных
   * @param {function} onError - функция обработки ошибки при запросе/получении данных
   */
  var activateMap = function (onSuccess, onError) {
    backend.loading(onSuccess, onError);
    utils.nodeMap.classList.remove('map--faded');
    isMapDisabled = false;
    isAdFormDisabled(false);
  };

  /**
   * Блокирует карту, фильтр и форму
   */
  var disableMap = function () {
    if (!utils.nodeMap.classList.contains('map--faded')) {
      utils.nodeMap.classList.add('map--faded');
    }
    isMapDisabled = true;
    isFilterDisabled(true);
    isAdFormDisabled(true);
  };
  disableMap();

  window.main = {
    mapDisabled: isMapDisabled,
    activate: activateMap,
    disable: disableMap,
    filter: isFilterDisabled
  };
})();
