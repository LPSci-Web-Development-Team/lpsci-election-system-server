'use strict';

const CANDIDATE_POSITIONS = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Auditor',
  'PIO',
  'Peace Officer',
  'Level Rep. (8)',
  'Level Rep. (9)',
  'Level Rep. (10)',
  'Level Rep. (11)',
  'Level Rep. (12)',
];

module.exports = function (Candidate) {
  Candidate.validatesInclusionOf('position', {
    in: CANDIDATE_POSITIONS,
    message: 'Invalid position for Candidate',
  });
};
