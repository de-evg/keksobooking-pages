'use strict';

(function () {
  var utils = window.utils;
  var inputAvatarImgElement = utils.nodeFormAd.querySelector('#avatar');
  var inputRoomImgElement = utils.nodeFormAd.querySelector('#images');
  var photoContainerElement = utils.nodeFormAd.querySelector('.ad-form__photo-container');
  var avatarDropZoneElement = utils.nodeFormAd.querySelector('.ad-form__field');
  var roomImgDropZoneElement = utils.nodeFormAd.querySelector('.ad-form__upload');
  var userImgAvatarElement = utils.nodeFormAd.querySelector('.ad-form-header__preview img');
  var ImageRoomSize = {
    WIDTH: 40,
    HEIGHT: 44
  };

  /**
   * Устанавилвает адрес для изображения из вставленного в input файла
   *
   * @param {Object} changedElement - измененный элемент формы (input)
   * @param {Object} image - обновляемый html объект изображения
   */
  var insertUserImage = function (changedElement, image) {
    var file = changedElement.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  /**
   * Добавляет изображения в DOM
   *
   * @param {Object} changedElement - измененный элемент формы (input)
   */
  var insertRoomImage = function (changedElement) {
    var photos = utils.nodeFormAd.querySelector('.ad-form__photo');
    photos.style.display = 'flex';
    photos.style.alignItems = 'center';
    photos.style.justifyContent = 'center';
    var img = document.createElement('Img');
    img.width = ImageRoomSize.WIDTH;
    img.height = ImageRoomSize.HEIGHT;
    insertUserImage(changedElement, img);
    if (photos.querySelector('img')) {
      var photosTemplate = photos.cloneNode(false);
      photosTemplate.appendChild(img);
      photoContainerElement.appendChild(photosTemplate);
    } else {
      photos.appendChild(img);
    }
  };

    // перетаскивание файлов из ОС в dropZone
  ['dragover', 'drop'].forEach(function (dragEvt) {
    window.addEventListener(dragEvt, function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    });
    avatarDropZoneElement.addEventListener(dragEvt, function (evt) {
      evt.preventDefault();
      if (dragEvt === 'drop') {
        var data = evt.dataTransfer;
        insertUserImage(data, userImgAvatarElement);
      }
    });
    roomImgDropZoneElement.addEventListener(dragEvt, function (evt) {
      evt.preventDefault();
      if (dragEvt === 'drop') {
        var data = evt.dataTransfer;
        insertRoomImage(data);
      }
    });
  });

  /**
   * Возвращает значение input для аватара в состояние по-умолчанию
   *
   * @param {Object} defaultValues - перечисление полей формы по-умолчанию
   */
  var resetUserAvatar = function (defaultValues) {
    inputAvatarImgElement.value = '';
    userImgAvatarElement.src = defaultValues.AVATAR;
  };

    /**
     * Возвращает значение input для изображений предложения в состояние по-умолчанию
     *
     */
  var resetRoomImages = function () {
    inputRoomImgElement.value = '';
    var photos = utils.nodeFormAd.querySelector('.ad-form__photo');
    var photosTemplate = photos.cloneNode(false);
    var allPhotos = utils.nodeFormAd.querySelectorAll('.ad-form__photo');
    allPhotos.forEach(function (photo) {
      photoContainerElement.removeChild(photo);
    });
    var fragment = document.createDocumentFragment();
    fragment.appendChild(photosTemplate);
    photoContainerElement.appendChild(fragment);
  };

  var UserImage = {
    AVATAR: {
      insert: insertUserImage,
      reset: resetUserAvatar
    },
    IMAGES: {
      insert: insertRoomImage,
      reset: resetRoomImages
    }
  };

  window.avatar = {
    user: userImgAvatarElement,
    image: UserImage
  };
})();
