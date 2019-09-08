'use strict';

(function () {
  var utils = window.utils;

  /**
   * Заполняет склонированный HTML элемент данными выбранного предложения.
   *
   * @param {Object} cardElement - склонированный HTML элемент
   * @param {Object} template - объект с данными для генерации новой карточки.
   * @param {Object} dataForCard - объект с данными выбранного предложения
   * @param {Object} types - словарь типа меток (eng: рус).
   * @return {Object} cardElement - DOM элемент карточки с предложением
   */
  var generateCardElement = function (cardElement, template, dataForCard, types) {

    /**
     * Проверяет полученные данные на наличие и целостность.
     *
     * @param {Object} someData - проверяемые данные
     * @param {Object} cardInnerElement - обновляемый элемент карточки.
     * @param {function} onSuccessCheck - обработчик при успешной проверке
     */
    var checkData = function (someData, cardInnerElement, onSuccessCheck) {
      try {
        if (!someData) {
          throw new SyntaxError('Данные некорректны');
        }
        onSuccessCheck();
      } catch (err) {
        cardInnerElement.style.display = 'none';
      }
    };

    // вставка аватара
    var userAvatar = cardElement.querySelector('.popup__avatar');
    checkData(dataForCard.author.avatar, userAvatar, function () {
      userAvatar.src = dataForCard.author.avatar;
    });

    // вставка заголовка
    var offerTitle = cardElement.querySelector('.popup__title');
    checkData(dataForCard.offer.title, offerTitle, function () {
      offerTitle.textContent = dataForCard.offer.title;
    });

    // вставка адреса
    var offerAddress = cardElement.querySelector('.popup__text--address');
    checkData(dataForCard.offer.address, offerAddress, function () {
      offerAddress.textContent = dataForCard.offer.address;
    });

    // вставка цены
    var offerPrice = cardElement.querySelector('.popup__text--price');
    checkData(dataForCard.offer.price, offerPrice, function () {
      offerPrice.textContent = dataForCard.offer.price + '₽/ночь';
    });

    // вставка типа жилья на русском языке
    var typeHousing = cardElement.querySelector('.popup__type');
    checkData(dataForCard.offer.type, typeHousing, function () {
      var offerType = Object.keys(types).filter(function (key) {
        return key.toLowerCase() === dataForCard.offer.type;
      });
      typeHousing.textContent = types[offerType];
    });

    // вставка описания
    var offerDescription = cardElement.querySelector('.popup__description');
    checkData(dataForCard.offer.description, offerDescription, function () {
      offerDescription.textContent = dataForCard.offer.description;
    });

    // вставка строки с количеством комнат и количеством гостей
    var offerCapacity = cardElement.querySelector('.popup__text--capacity');
    try {
      if (!dataForCard.offer.rooms || !dataForCard.offer.guests) {
        throw new SyntaxError('Данные некорректны');
      }
      offerCapacity.textContent = dataForCard.offer.rooms + ' комнаты для ' + dataForCard.offer.guests;
    } catch (err) {
      offerCapacity.style.display = 'none';
    }

    var offerTime = cardElement.querySelector('.popup__text--time');
    try {
      if (!dataForCard.offer.checkin || !dataForCard.offer.checkout) {
        throw new SyntaxError('Данные некорректны');
      }
      offerTime.textContent = 'Заезд после ' + dataForCard.offer.checkin + ', выезд до ' + dataForCard.offer.checkout;
    } catch (err) {
      offerTime.style.display = 'none';
    }

    // вставка особенностей
    var featuresElement = cardElement.querySelector('.popup__features');
    try {
      if (dataForCard.offer.features.length === 0 || !dataForCard.offer.features) {
        throw new SyntaxError('Данные некорректны');
      }
      // удаление из шаблона списка особенностей
      while (featuresElement.querySelector('.popup__feature')) {
        featuresElement.removeChild(featuresElement.querySelector('.popup__feature'));
      }

      // вставка актуальных особенностей
      dataForCard.offer.features.forEach(function (feature) {
        var listItemElement = document.createElement('li');
        listItemElement.classList.add('popup__feature', 'popup__feature--' + feature);
        featuresElement.appendChild(listItemElement);
      });
    } catch (err) {
      featuresElement.style.display = 'none';
    }

    // вставка фотографий
    try {
      var photosElement = cardElement.querySelector('.popup__photos');
      var imgElement = photosElement.querySelector('img');
      if (dataForCard.offer.photos.length === 0 || !dataForCard.offer.photos.length) {
        throw new SyntaxError('Данные некорректны');
      }
      dataForCard.offer.photos.forEach(function (addressPhoto) {
        var newImg = imgElement.cloneNode();
        newImg.src = addressPhoto;
        photosElement.appendChild(newImg);
      });
      photosElement.removeChild(imgElement);
    } catch (err) {
      photosElement.style.display = 'none';
    }

    return cardElement;
  };

  /**
   * Добавляет в DOM карту с предложением.
   *
   * @param {Object} template - объект с данными для генерации новой карточки.
   * @param {Object} dataForCard - объект с данными конкретной метки
   * @param {Object} types - словарь типа меток (eng: рус).
   */
  var renderCard = function (template, dataForCard, types) {
    var cardElement = template.CARD.cloneNode(true);
    var generatedCardElement = generateCardElement(cardElement, template, dataForCard, types);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(generatedCardElement);
    utils.nodeFiltersContainer.before(fragment);

    var cardCloseElement = utils.nodeMap.querySelector('.map__card .popup__close');
    cardCloseElement.addEventListener('click', onButtonCloseClick);
    window.addEventListener('keydown', onCardEscPress);
  };

  var closeCard = function () {
    if (utils.nodeMap.querySelector('.map__card')) {
      var activatedPin = utils.nodeMapPins.querySelector('.map__pin--active');
      if (activatedPin) {
        activatedPin.classList.remove('map__pin--active');
      }
      var currentCard = utils.nodeMap.querySelector('.map__card');
      utils.nodeMap.removeChild(currentCard);
      window.removeEventListener('keydown', onCardEscPress);
    }
  };

  /**
   * Обработчик нажатия на кнопку закрытия карточки.
   *
   */
  var onButtonCloseClick = function () {
    closeCard();
  };

  /**
   * Обработчик нажатия на калвишу ESC при открытой карточке.
   * @param {Object} evt - DOM объект события
   */
  var onCardEscPress = function (evt) {
    if (evt.keyCode === utils.key.ESC) {
      closeCard();
    }
  };

  window.card = {
    render: renderCard,
    close: onButtonCloseClick,
  };
})();
