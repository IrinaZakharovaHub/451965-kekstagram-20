'use strict';
(function () {
  var PHOTO_COUNT = 25;
  var MIN_PHOTO_INDEX = 1;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var COMMENT_MIN_COUNT = 5;
  var COMMENT_MAX_COUNT = 20;
  var MIN_AVATAR_INDEX = 1;
  var MAX_AVATAR_INDEX = 6;

  var COMMENT_MESSAGE_SENTENCES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var COMMENT_AUTHOR_NAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];

  var generateRandomIntFromRange = function (leftRangeLimit, rightRangeLimit) {
    var randomIntFromRange = leftRangeLimit + Math.round(Math.random() * (rightRangeLimit - leftRangeLimit));

    return randomIntFromRange;
  };

  var generateRandomAvatarUrl = function () {
    var avatarIndex = generateRandomIntFromRange(MIN_AVATAR_INDEX, MAX_AVATAR_INDEX);

    return 'img/avatar-' + avatarIndex.toString() + '.svg';
  };

  var generateFirstSentenceIndex = function () {
    return Math.round(Math.random() * (COMMENT_MESSAGE_SENTENCES.length - 1));
  };

  var generateLeftRangeLimit = function (firstSentenceIndex) {
    var leftRangeLimit = Math.round(Math.random()) * (firstSentenceIndex + 1);

    if (firstSentenceIndex === COMMENT_MESSAGE_SENTENCES.length - 1) {
      if (leftRangeLimit === firstSentenceIndex + 1) {
        leftRangeLimit = 0;
      }
    }

    if (firstSentenceIndex === 0) {
      if (leftRangeLimit === 0) {
        leftRangeLimit = 1;
      }
    }

    return leftRangeLimit;
  };

  var generateRightRangeLimit = function (firstSentenceIndex, leftRangeLimit) {
    var rightRangeLimit = firstSentenceIndex - 1;

    if (rightRangeLimit === -1 || leftRangeLimit === firstSentenceIndex + 1) {
      rightRangeLimit = COMMENT_MESSAGE_SENTENCES.length - 1;
    }

    return rightRangeLimit;
  };

  var generateSecondSentenceIndex = function (firstSentenceIndex) {
    var leftRangeLimit = generateLeftRangeLimit(firstSentenceIndex);
    var rightRangeLimit = generateRightRangeLimit(firstSentenceIndex, leftRangeLimit);
    var secondSentenceIndex = generateRandomIntFromRange(leftRangeLimit, rightRangeLimit);

    return secondSentenceIndex;
  };

  var generateRandomMessage = function () {
    var firstSentenceIndex = generateFirstSentenceIndex();
    var message = COMMENT_MESSAGE_SENTENCES[firstSentenceIndex];
    var needForSecondSentence = Math.round(Math.random()) === 1 ? true : false;

    if (needForSecondSentence) {
      var secondSentenceIndex = generateSecondSentenceIndex(firstSentenceIndex);
      message += ' ' + COMMENT_MESSAGE_SENTENCES[secondSentenceIndex];
    }

    return message;
  };

  var generateRandomName = function () {
    var authorNameIndex = Math.round(Math.random() * (COMMENT_AUTHOR_NAMES.length - 1));

    return COMMENT_AUTHOR_NAMES[authorNameIndex];
  };

  var generateRandomComment = function () {
    var comment = {
      avatar: generateRandomAvatarUrl(),
      message: generateRandomMessage(),
      name: generateRandomName()
    };

    return comment;
  };

  var generateRandomComments = function (commentCount) {
    var comments = [];

    for (var i = 0; i < commentCount; i++) {
      comments.push(generateRandomComment());
    }

    return comments;
  };

  var generateRandomPhoto = function (number) {
    var commentCount = generateRandomIntFromRange(COMMENT_MIN_COUNT, COMMENT_MAX_COUNT);
    var photo = {
      url: 'photos/' + (number).toString() + '.jpg',
      description: 'Фотография №' + number.toString(),
      likes: generateRandomIntFromRange(MIN_LIKES, MAX_LIKES),
      comments: generateRandomComments(commentCount)
    };

    return photo;
  };

  var generateRandomPhotos = function () {
    var photos = [];

    for (var i = 0; i < PHOTO_COUNT; i++) {
      photos.push(generateRandomPhoto(MIN_PHOTO_INDEX + i));
    }

    return photos;
  };

  var createPhotoElement = function (photo) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').setAttribute('src', photo.url);
    photoElement.querySelector('.picture__likes').textContent = photo.likes.toString();
    photoElement.querySelector('.picture__comments').textContent = photo.comments.length.toString();

    return photoElement;
  };

  var fillPicturesBlock = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < PHOTO_COUNT; i++) {
      fragment.appendChild(createPhotoElement(photos[i]));
    }

    var picturesElement = document.querySelector('.pictures');

    picturesElement.appendChild(fragment);
  };

  var createCommentElement = function (comment) {
    var commentElement = commentTemplate.cloneNode(true);

    var avatarElement = commentElement.querySelector('.social__picture');
    avatarElement.setAttribute('src', comment.avatar);
    avatarElement.setAttribute('alt', comment.name);
    commentElement.querySelector('.social__text').textContent = comment.message;

    return commentElement;
  };

  var fillCommentsBlock = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos[0].comments.length; i++) {
      fragment.appendChild(createCommentElement(photos[0].comments[i]));
    }

    var commentsElement = document.querySelector('.social__comments');

    commentsElement.appendChild(fragment);
  };

  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var photos = generateRandomPhotos();

  fillPicturesBlock();

  var bigPhotoElement = document.querySelector('.big-picture');

  bigPhotoElement.classList.remove('hidden');

  var bigPhotoImgElement = bigPhotoElement.querySelector('.big-picture__img img');

  bigPhotoImgElement.setAttribute('src', photos[0].url);
  bigPhotoElement.querySelector('.likes-count').textContent = photos[0].likes.toString();
  bigPhotoElement.querySelector('.comments-count').textContent = photos[0].comments.length.toString();

  var commentTemplate = document.querySelector('#comment')
    .content
    .querySelector('.social__comment');

  fillCommentsBlock();

  bigPhotoElement.querySelector('.social__caption').textContent = photos[0].description.toString();
  bigPhotoElement.querySelector('.social__comment-count').classList.add('hidden');
  bigPhotoElement.querySelector('.comments-loader').classList.add('hidden');
  document.querySelector('body').classList.add('modal-open');
})();
