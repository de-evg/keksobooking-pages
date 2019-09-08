'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 600;
  var lastTimeout = 0;

  /**
   * Задает таймер для устранения "дребезга".
   *
   * @param {function} cd - callback функция
   */
  var setDebounce = function (cd) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cd, DEBOUNCE_INTERVAL);
  };

  window.debounce = {
    set: setDebounce
  };
})();
