'use strict';

(function () {
  var utils = window.utils;
  var main = window.main;
  var avatar = window.avatar;
  var inputTitleElement = utils.nodeFormAd.querySelector('#title');
  var selectTypeOfferElement = utils.nodeFormAd.querySelector('#type');
  var selectTimeInElement = utils.nodeFormAd.querySelector('#timein');
  var selectTimeOutElement = utils.nodeFormAd.querySelector('#timeout');
  var selectRoomElement = utils.nodeFormAd.querySelector('#room_number');
  var selectCapacityElement = utils.nodeFormAd.querySelector('#capacity');
  var priceElement = utils.nodeFormAd.querySelector('#price');
  var addressElement = utils.nodeFormAd.querySelector('#address');
  var textDescriptionElement = utils.nodeFormAd.querySelector('#description');
  var featureElements = utils.nodeFormAd.querySelectorAll('[name=features]');

  var TimeMap = {
    TYPE: selectTypeOfferElement,
    TIMEIN: selectTimeOutElement,
    TIMEOUT: selectTimeInElement,
    ROOM: selectRoomElement,
    CAPACITY: selectCapacityElement,
    PRICE: priceElement
  };

  var OfferMinPriceMap = {
    PALACE: {
      TYPE: 'Дворец',
      MIN_PRICE: 10000
    },
    FLAT: {
      TYPE: 'Квартира',
      MIN_PRICE: 1000
    },
    HOUSE: {
      TYPE: 'Дом',
      MIN_PRICE: 5000
    },
    BUNGALO: {
      TYPE: 'Бунгало',
      MIN_PRICE: 0
    }
  };

  var SizeMainPin = {
    WIDTH: 65,
    HEIGHT: 65,
    POINTER_HEIGHT: 22
  };
  var StartUserPinCoordinate = {
    X: 570,
    Y: 375
  };

  var DefaultFormValues = {
    TITLE: '',
    ADDRESS: '602, 407',
    TYPE: 'flat',
    PRICE: ['', '1000'],
    TIMEIN: '12:00',
    TIMEOUT: '12:00',
    ROOM: '1',
    CAPACITY: '3',
    FEATURE: false,
    DESCRIPTION: '',
    AVATAR: 'img/muffin-grey.svg'
  };

  var Rooms = {
    '100': {
      value: ['0'],
      validateMessage: 'Для этого предложения не предусмотрено размещение гостей'
    },
    '1': {
      value: ['1'],
      validateMessage: 'Для этого предложения возможно размещение не более 1 гостя'
    },
    '2': {
      value: ['1', '2'],
      validateMessage: 'Для этого предложения возможно размещение не более 2 гостей'
    },
    '3': {
      value: ['1', '2', '3'],
      validateMessage: 'Для этого предложения возможно размещение не более 3 гостей'
    }
  };

  /**
   * Проверяет соответствует ли количество комнат количеству гостей.
   *
   */
  var validateCapacity = function () {
    var selectedRoom = getSelectedOption(selectRoomElement);
    var selectedCapacity = getSelectedOption(selectCapacityElement);
    var maxCapacity = Rooms[selectedRoom.value].value.slice().filter(function (capacityPossiblyValue) {
      return capacityPossiblyValue === selectedCapacity.value;
    });
    if (maxCapacity <= selectedCapacity.value && maxCapacity.length > 0) {
      selectCapacityElement.setCustomValidity('');
    } else {
      selectCapacityElement.setCustomValidity(Rooms[selectedRoom.value].validateMessage);
    }
  };

  /**
   * Генерирует и изменяет значения координат главной метки в поле адреса в форме.
   *
   * @param {Object} startPinCoordinate - начальные координаты метки.
   * @param {Object} sizeMainPin - перечисление размеров метки
   * @param {boolean} flag - состояние активности карты
   */
  var generateAddress = function (startPinCoordinate, sizeMainPin, flag) {
    if (flag) {
      var x = Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2));
      var y = Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT / 2));
    } else {
      x = Math.floor((startPinCoordinate.X + sizeMainPin.WIDTH / 2));
      y = Math.floor((startPinCoordinate.Y + sizeMainPin.HEIGHT + sizeMainPin.POINTER_HEIGHT));
    }
    addressElement.value = x + ', ' + y;
  };
  generateAddress(StartUserPinCoordinate, SizeMainPin, main.mapDisabled);

  /**
   * Получает объект option в состоянии selected
   *
   * @param {Collection} select - коллекция option
   * @return {Object} selectedOption - выбранный option
   */
  var getSelectedOption = function (select) {
    var index;
    var selectedOption;
    index = select.selectedIndex;
    selectedOption = select[index];
    select.addEventListener('change', function () {
      index = select.selectedIndex;
      selectedOption = select[index];
    });
    return selectedOption;
  };

  /**
   * Устанавливает минимальную цену в зависимости от типа жилья
   *
   * @param {Object} evtChange - событие изменения элмента формы
   */
  var setTime = function (evtChange) {
    TimeMap[evtChange.target.id.toUpperCase()].value = evtChange.target.value;
  };

  /**
   * Устанавливает минимальную цену в зависимости от типа жилья
   *
   */
  var setMinPrice = function () {
    var selectedOption = getSelectedOption(selectTypeOfferElement);
    var attribute = OfferMinPriceMap[selectedOption.value.toUpperCase()].MIN_PRICE;
    priceElement.min = attribute;
    priceElement.placeholder = attribute;
  };


  var Selector = {
    TYPE: {
      updateForm: setMinPrice
    },
    TIMEIN: {
      updateForm: setTime
    },
    TIMEOUT: {
      updateForm: setTime
    },
    ROOM_NUMBER: {
      updateForm: validateCapacity
    },
    CAPACITY: {
      updateForm: validateCapacity
    }
  };

  Selector.TYPE.updateForm();
  Selector.CAPACITY.updateForm();

  utils.nodeFormAd.addEventListener('change', function (evt) {
    switch (evt.target.tagName) {
      case 'SELECT':
        Selector[evt.target.id.toUpperCase()].updateForm(evt);
        break;
      case 'INPUT':
        if (evt.target.type === 'file') {
          avatar.image[evt.target.name.toUpperCase()].insert(evt.target, avatar.user);
        }
        break;
    }
  });

  /**
   * Приводит значения полей формы к исходному состоянию
   *
   */
  var resetForm = function () {
    inputTitleElement.value = DefaultFormValues.TITLE;
    addressElement.value = DefaultFormValues.ADDRESS;
    selectTypeOfferElement.value = DefaultFormValues.TYPE;
    priceElement.value = DefaultFormValues.PRICE[0];
    priceElement.placeholder = DefaultFormValues.PRICE[1];
    selectTimeInElement.value = DefaultFormValues.TIMEIN;
    selectTimeOutElement.value = DefaultFormValues.TIMEOUT;
    selectRoomElement.value = DefaultFormValues.ROOM;
    selectCapacityElement.value = DefaultFormValues.CAPACITY;
    textDescriptionElement.value = DefaultFormValues.DESCRIPTION;
    featureElements.forEach(function (feature) {
      feature.checked = DefaultFormValues.FEATURE;
    });
    avatar.image.AVATAR.reset(DefaultFormValues);
    avatar.image.IMAGES.reset();
  };

  utils.nodeFormAd.addEventListener('reset', function (evt) {
    evt.preventDefault();
    resetForm();
  });

  window.form = {
    sizePin: SizeMainPin,
    address: generateAddress,
    pinCoords: StartUserPinCoordinate,
    reset: resetForm
  };
})();
