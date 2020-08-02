// ANCHOR Joi
import * as Joi from '@hapi/joi';

// ANCHOR Payload
import { EPosition } from '../candidate';

/* ANCHOR: Create Candidate Schema ----------------------------------------------- */
export const createUpdateCandidateSchema = Joi.object().keys({
  position: Joi.string()
    .trim()
    .valid(...Object.values(EPosition))
    .required(),
  partyId: Joi.string()
    .trim()
    .required(),
});
