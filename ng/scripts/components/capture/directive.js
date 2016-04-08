'use strict';

angular.module('ngApp')
  .directive('capturePhoto', function ($cordovaCamera, Media) {
    return {
      template: '<a href="#/" class="btn" ng-click"ck()">cam</a>',
      restrict: 'E',
      link: function (scope, element) {
        document.addEventListener('deviceready', function () {
          var captureOptions = {
            quality: 100,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.PNG,
            targetWidth: 300,
            //targetHeight: 100,
            saveToPhotoAlbum: false,
            correctOrientation: true
          };

          element.on('click', function () {
            Materialize.toast('Capture photo triggered', 500);
            $cordovaCamera.getPicture(captureOptions).then(handlePhoto);
          });
        });

        function handlePhoto(imageData) {
          var mediaObject = new Media();
          mediaObject.imageData = imageData;
          mediaObject.$save().then(function () {
            Materialize.toast('Item uploded!');
          });
        }
      }
    };
  });
