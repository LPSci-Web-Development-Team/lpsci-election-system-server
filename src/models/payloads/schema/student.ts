// ANCHOR Joi
import * as Joi from '@hapi/joi';

/* ANCHOR: Joi validation parameters ---------------------------------------- */
const LRN_LENGTH_CHARACTERS = 12;

/* ANCHOR: Create Student Schema ----------------------------------------------- */
export const createUpdateStudentSchema = Joi.object().keys({
  learnerReferenceNumber: Joi.string()
    .trim()
    .length(LRN_LENGTH_CHARACTERS)
    .required(),
});
