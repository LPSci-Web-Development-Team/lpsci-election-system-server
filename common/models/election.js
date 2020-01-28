'use strict';

module.exports = function (Election) {
  Election.validatesInclusionOf('state', {
    in: ['register', 'vote', 'disable'],
    message: 'invalid state for Election',
  });
};
