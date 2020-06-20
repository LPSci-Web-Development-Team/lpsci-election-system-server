// ANCHOR Joi
import * as Joi from '@hapi/joi';

/* ANCHOR: Joi validation parameters ---------------------------------------- */
const YEAR_LENGTH_CHARACTERS = 9;

/* ANCHOR: Create School Year Schema ----------------------------------------------- */
export const createUpdateSchoolYearSchema = Joi.object().keys({
  year: Joi.string()
    .trim()
    .length(YEAR_LENGTH_CHARACTERS)
    .required(),
});
