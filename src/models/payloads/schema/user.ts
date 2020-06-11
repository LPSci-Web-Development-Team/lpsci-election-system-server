// ANCHOR Joi
import * as Joi from '@hapi/joi';

// ANCHOR Payloads
import { Sex } from '../user';

/* ANCHOR: Joi validation parameters ---------------------------------------- */
const NAME_MIN_CHARACTERS = 1;
const NAME_MAX_CHARACTERS = 128;
const PASSWORD_MAX_CHARACTERS = 128;
const PASSWORD_MIN_CHARACTERS = 8;
const ADDRESS_MIN_CHARACTERS = 1;

/* ANCHOR: Joi common validation objects ------------------------------------ */
const NAME_VALIDATOR = Joi.string()
  .min(NAME_MIN_CHARACTERS)
  .max(NAME_MAX_CHARACTERS)
  .trim()
  .required();

const MIDDLE_NAME_VALIDATOR = Joi.string()
  .min(NAME_MIN_CHARACTERS)
  .max(NAME_MAX_CHARACTERS)
  .trim();

const EMAIL_VALIDATOR = Joi.string()
  .email()
  .required();

const PASSWORD_VALIDATOR = Joi.string()
  .min(PASSWORD_MIN_CHARACTERS)
  .max(PASSWORD_MAX_CHARACTERS)
  .required();

const PHONE_NUMBER_VALIDATOR = Joi.string()
  .trim();

const ADDRESS_VALIDATOR = Joi.string()
  .min(ADDRESS_MIN_CHARACTERS)
  .trim()
  .required();

const SEX_VALIDATOR = Joi.string()
  .valid(...Object.values(Sex))
  .required();

const BIRTH_DATE_VALIDATOR = Joi.date()
  .iso()
  .max('now')
  .required();

const DISPLAY_PHOTO_UUID_VALIDATOR = Joi.string()
  .optional();

/* ANCHOR: Sign Up Schema --------------------------------------------------- */
export const signUpSchema = Joi.object().keys({
  // Personal
  firstName: NAME_VALIDATOR,
  middleName: MIDDLE_NAME_VALIDATOR,
  lastName: NAME_VALIDATOR,
  birthDate: BIRTH_DATE_VALIDATOR,
  sex: SEX_VALIDATOR,
  // Account
  email: EMAIL_VALIDATOR,
  password: PASSWORD_VALIDATOR,
  displayPhotoUuid: DISPLAY_PHOTO_UUID_VALIDATOR,
  // Contact
  streetAddress: ADDRESS_VALIDATOR,
  barangay: ADDRESS_VALIDATOR,
  city: ADDRESS_VALIDATOR,
  phoneNumber: PHONE_NUMBER_VALIDATOR,
});

/* ANCHOR: Update User Schema ----------------------------------------------- */
export const updateUserSchema = Joi.object().keys({
  // Personal
  firstName: NAME_VALIDATOR,
  middleName: MIDDLE_NAME_VALIDATOR,
  lastName: NAME_VALIDATOR,
  birthDate: BIRTH_DATE_VALIDATOR,
  sex: SEX_VALIDATOR,
  // Account
  email: EMAIL_VALIDATOR,
  // Contact
  streetAddress: ADDRESS_VALIDATOR,
  barangay: ADDRESS_VALIDATOR,
  city: ADDRESS_VALIDATOR,
  phoneNumber: PHONE_NUMBER_VALIDATOR,
});

/* ANCHOR: Update display photo schema -------------------------------------- */
export const updateDisplayPhotoSchema = Joi.object().keys({
  displayPhotoUuid: DISPLAY_PHOTO_UUID_VALIDATOR,
});
