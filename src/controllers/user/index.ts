// ANCHOR Typeorm
import { getRepository } from 'typeorm';
import { formatDisplayName } from '../../utils/formatDisplayName';

// ANCHOR Payloads
import {
  IFirebaseUserPayload, ISignUpPayload, IUpdateUserPayload, userToFirebasePayload,
} from '../../models/payloads/user';

// ANCHOR Entities
import { User } from '../../models/entities/User';

// ANCHOR Utils
import { firebaseAdmin } from '../../utils/firebaseAdmin';
import { logger } from '../../utils/logger';

// ANCHOR Errors
import { CodedError } from '../../errors/custom/CodedError';
import { ErrorCode } from '../../errors';

/**
 * ANCHOR: Create user in firebase and postgre
 * @param payload Sign up payload
 */
export const createUser = async (
  payload: ISignUpPayload,
) => {
  const {
    email,
    password,
    firstName,
    middleName,
    lastName,
    phoneNumber,
    streetAddress,
    barangay,
    city,
    sex,
    birthDate,
  } = payload;

  const userRepository = getRepository(User);

  // ANCHOR Firebase payload
  const firebasePayload: IFirebaseUserPayload = {
    email,
    password,
    displayName: formatDisplayName({
      firstName,
      middleName,
      lastName,
    }),
  };

  // ANCHOR: Create user in firebase
  const userRecord = await firebaseAdmin
    .auth()
    .createUser(firebasePayload)
    .catch((error) => {
      if (error.code === 'auth/email-already-exists') {
        throw new CodedError(
          ErrorCode.EmailExists,
          `The email address ${email} is already in use by another account.`,
        );
      }

      logger.error('Error creating user', error);

      throw new CodedError(
        ErrorCode.DatabaseError,
        error.message,
      );
    });

  // ANCHOR Create user for postgre
  const newUser = userRepository
    .create({
      id: userRecord.uid,
      firstName,
      middleName,
      lastName,
      birthDate,
      sex,
      phoneNumber,
      email,
      streetAddress,
      barangay,
      city,
    });

  // ANCHOR Save user in postgre
  const user = await userRepository
    .save(newUser)
    .catch(async (error) => {
      logger.error(
        'User created in firebase but failed to save in the database',
        error,
      );

      // ANCHOR Delete user
      await firebaseAdmin
        .auth()
        .deleteUser(userRecord.uid);

      throw new CodedError(
        ErrorCode.DatabaseError,
        error.message,
      );
    });

  // TODO Add image upload for display photo

  return user;
};

/**
 * ANCHOR: Get all users
 */
export const getUsers = async () => (
  getRepository(User)
    .find({
      order: {
        createdAt: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get a user by email
 * @param email User's email
 */
export const getUserByEmail = (
  email: string,
) => (
  getRepository(User)
    .findOne({
      where: {
        email,
      },
    })
);

/**
 * ANCHOR: Get a user by id
 * @param id User id
 */
export const getUserById = (
  id: string,
) => (
  getRepository(User)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Update user
 * Updates every user field except for the password,
 * and display photo.
 *
 * @param payload Payload from client
 * @param currentUser Current user object instance
 */
export async function updateUser(
  payload: IUpdateUserPayload,
  currentUser: User,
) {
  const {
    email,
    firstName,
    middleName,
    lastName,
    phoneNumber,
    streetAddress,
    barangay,
    city,
    sex,
    birthDate,
  } = payload;

  const userBackup = userToFirebasePayload(currentUser);

  const firebasePayload: IFirebaseUserPayload = {
    ...userBackup,
    email: payload.email,
  };

  // ANCHOR Update user in firebase
  await firebaseAdmin
    .auth()
    .updateUser(currentUser.id, firebasePayload);

  // ANCHOR Update user in postgre
  const newUser = currentUser;
  newUser.firstName = firstName;
  newUser.middleName = middleName;
  newUser.lastName = lastName;
  newUser.birthDate = birthDate;
  newUser.sex = sex;
  newUser.email = email;
  newUser.streetAddress = streetAddress;
  newUser.barangay = barangay;
  newUser.city = city;
  newUser.phoneNumber = phoneNumber;

  return getRepository(User)
    .save(newUser)
    .catch(async (error) => {
      logger.error(
        'User updated in firebase but failed to update in database',
        error,
      );

      // ANCHOR On database save failure, attempt consistency by restoring old backup
      await firebaseAdmin.auth().updateUser(newUser.id, userBackup);

      throw new CodedError(ErrorCode.DatabaseError, error.message);
    });
}
