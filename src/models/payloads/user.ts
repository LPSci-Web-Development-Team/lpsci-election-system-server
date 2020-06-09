// ANCHOR Entities
import { User } from '../entities/User';

/* ANCHOR: User sex enum ---------------------------------------------------- */
export enum Sex {
  M = 'male',
  F = 'female',
}

/* ANCHOR: Firebase User Payload -------------------------------------------- */
export interface IFirebaseUserPayload {
  readonly displayName: string;
  readonly email: string;
  readonly password?: string;
  readonly photoUrl?: string;
  readonly phoneNumber?: string;
  readonly disabled?: boolean;
  readonly emailVerified?: boolean;
}

/* ANCHOR: Sign Up Payload -------------------------------------------------- */
export interface ISignUpPayload {
  readonly firstName: string;
  readonly middleName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly streetAddress: string;
  readonly barangay: string;
  readonly city: string;
  readonly phoneNumber?: string;
  readonly displayPhotoUuid?: string;
  readonly birthDate: string;
  readonly sex: Sex;
}

/* ANCHOR: Fetch User Payload ----------------------------------------------- */
export interface IFetchUserPayload {
  readonly id: string;
  readonly firstName: string;
  readonly middleName: string;
  readonly lastName: string;
  readonly birthDate: Date;
  readonly sex: Sex;
  readonly email: string;
  readonly displayPhotoUuid?: string;
  readonly phoneNumber?: string;
  readonly streetAddress: string;
  readonly barangay: string;
  readonly city: string;
}

/* ANCHOR: Update User Payload ---------------------------------------------- */
export interface IUpdateUserPayload {
  readonly firstName: string;
  readonly middleName: string;
  readonly lastName: string;
  readonly email: string;
  readonly birthDate: Date;
  readonly phoneNumber: string;
  readonly sex: Sex;
  readonly streetAddress: string;
  readonly barangay: string;
  readonly city: string;
}

/* ANCHOR: Update display photo payload ------------------------------------- */
export interface IUpdateDisplayPhotoPayload {
  readonly displayPhotoUuid: string;
}

/**
 * ANCHOR: User to fetch payload
 * @param user User entity
 */
export const userToFetchPayload = (
  user: User,
): IFetchUserPayload => {
  const {
    id,
    firstName,
    middleName,
    lastName,
    sex,
    birthDate,
    email,
    streetAddress,
    barangay,
    city,
    displayPhotoUuid,
    phoneNumber,
  } = user;

  return {
    id,
    firstName,
    middleName,
    lastName,
    sex,
    birthDate,
    email,
    streetAddress,
    barangay,
    city,
    displayPhotoUuid,
    phoneNumber,
  };
};
