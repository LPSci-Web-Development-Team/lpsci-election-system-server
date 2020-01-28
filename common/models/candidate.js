'use strict';

const CANDIDATE_POSITIONS = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Auditor',
  'Public Information Officer',
  'Peace Officer',
  'Grade 8 Level Representative',
  'Grade 9 Level Representative',
  'Grade 10 Level Representative',
  'Grade 11 Level Representative',
  'Grade 12 Level Representative',
];

module.exports = function (Candidate) {
  Candidate.validatesInclusionOf('position', {
    in: CANDIDATE_POSITIONS,
    message: 'Invalid position for Candidate',
  });
};
