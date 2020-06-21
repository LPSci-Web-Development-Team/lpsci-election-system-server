// ANCHOR Joi
import * as Joi from '@hapi/joi';

/* ANCHOR: Create Party Schema ----------------------------------------------- */
export const createUpdatePartySchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .required(),
  color: Joi.string()
    .trim()
    .required(),
});
