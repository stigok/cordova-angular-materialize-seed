'use strict';

angular.module('ngApp')
  .service('Media', function ($resource) {
    return $resource('http://192.168.1.115:42001/api/whitehole');
  });
