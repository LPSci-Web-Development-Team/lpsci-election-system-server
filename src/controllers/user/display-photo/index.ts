// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { User } from '../../../models/entities/User';

// ANCHOR Payloads
import { IUpdateDisplayPhotoPayload, userToFirebasePayload } from '../../../models/payloads/user';

// ANCHOR Utils
import { firebaseAdmin } from '../../../utils/firebaseAdmin';

/**
 * ANCHOR: Update user's display photo
 * @param user User entity
 * @param param Display photo
 */
export const updateDisplayPhoto = async (
  user: User,
  { displayPhotoUuid }: IUpdateDisplayPhotoPayload,
) => {
  if (displayPhotoUuid === user.displayPhotoUuid) {
    return user;
  }

  const newUser = user;

  newUser.displayPhotoUuid = displayPhotoUuid;
  const firebasePayload = userToFirebasePayload(newUser);

  await firebaseAdmin
    .auth()
    .updateUser(newUser.id, firebasePayload);

  // TODO Add upload file

  return getRepository(User).save(newUser);
};

/**
 * Delete user's display photo
 * @param user User entity
 */
export const deleteDisplayPhoto = async (
  user: User,
) => {
  if (!user.displayPhotoUuid) {
    return user;
  }

  // TODO Add delete file

  const newUser = user;
  newUser.displayPhotoUuid = undefined;

  const firebasePayload = userToFirebasePayload(newUser);

  await firebaseAdmin
    .auth()
    .updateUser(newUser.id, firebasePayload);

  return getRepository(User).save(newUser);
};
