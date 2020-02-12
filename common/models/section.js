'use strict';

const SECTION_GRADE_LEVELS = [
  7,
  8,
  9,
  10,
  11,
  12,
];

module.exports = function (Section) {
  Section.validatesInclusionOf('gradeLevel', {
    in: SECTION_GRADE_LEVELS,
    message: 'Invalid grade level',
  });
};
