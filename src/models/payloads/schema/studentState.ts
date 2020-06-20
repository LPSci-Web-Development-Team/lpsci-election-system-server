// ANCHOR Joi
import * as Joi from '@hapi/joi';

// ANCHOR Payloads
import { EStudentState } from '../studentState';

/* ANCHOR: Create Student Schema ----------------------------------------------- */
export const createUpdateStudentStateSchema = Joi.object().keys({
  state: Joi.string()
    .trim()
    .valid(...Object.values(EStudentState))
    .required(),
  schoolYear: Joi.string()
    .trim()
    .required(),
});
