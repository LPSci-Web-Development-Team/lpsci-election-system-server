'use strict';

module.exports = function (Voter) {
  Voter.validatesUniquenessOf(
    'lrn', { message: 'It seems like you have already registered' },
  );
};
