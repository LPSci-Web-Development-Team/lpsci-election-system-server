// ANCHOR Joi
import * as Joi from '@hapi/joi';

// ANCHOR Payload
import { EGrade } from '../section';

/* ANCHOR: Create School Year Schema ----------------------------------------------- */
export const createUpdateSectionSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .required(),
  gradeLevel: Joi.string()
    .trim()
    .valid(...Object.values(EGrade))
    .required(),
  adviser: Joi.string()
    .trim()
    .required(),
});
