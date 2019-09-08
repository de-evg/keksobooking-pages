'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;
  var PinsSettings = {
    WIDTH_PIN: 50,
    HEIGHT_PIN: 70,
    MAX_PINS: 5
  };
  var Method = {
    GET: ['GET', 'https://js.dump.academy/keksobooking/data'],
    POST: ['POST', 'https://js.dump.academy/keksobooking']
  };

  /**
   * Настройки запрса на сервер
   *
   * @param {Object} settings -параметры для данного метода запроса
   */
  var xhrRequest = function (settings) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        settings.success(xhr.response, PinsSettings);
      } else {
        settings.error();
      }
    });
    xhr.addEventListener('error', function () {
      settings.error();
    });

    xhr.addEventListener('timeout', function () {
      settings.error();
    });

    xhr.timeout = TIMEOUT;
    xhr.open(settings.METHOD, settings.URL);
    xhr.send(settings.BODY);
  };

  /**
   * Генерирует объект с настройками запроса.
   *
   * @param {Array} method - используемый метод и url сервера
   * @param {function} onSuccess - обработчик при успешном получении данных
   * @param {function} onError -  обработчик при ошибке
   * @param {Object} formData - данные формы отправляемые в теле запроса
   * @return {Object} Settings - объект с настройками запроса
   */
  var getSettings = function (method, onSuccess, onError, formData) {
    var Settings = {
      METHOD: method[0],
      URL: method[1],
      BODY: formData,
      success: onSuccess,
      error: onError
    };
    return Settings;
  };

  /**
   * Получает данные с сервера.
   *
   * @param {function} onSuccess - обработчик при успешном получении данных
   * @param {function} onError -  обработчик при ошибке
   */
  var load = function (onSuccess, onError) {
    var MethodSettings = getSettings(Method.GET, onSuccess, onError);
    xhrRequest(MethodSettings);
  };

  /**
   * Отправляет на сервер форму.
   *
   * @param {function} onSuccess - обработчик при успешном отправлении данных
   * @param {function} onError -  обработчик при ошибке
   * @param {Object} formData - данные формы
   */
  var save = function (onSuccess, onError, formData) {
    var MethodSettings = getSettings(Method.POST, onSuccess, onError, formData);
    xhrRequest(MethodSettings);
  };

  window.backend = {
    loading: load,
    publish: save
  };
})();
