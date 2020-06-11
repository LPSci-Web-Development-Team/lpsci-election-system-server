// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entites
import { User } from '../../../models/entities/User';

// ANCHOR Utils
import { firebaseAdmin } from '../../../utils/firebaseAdmin';

/**
 * ANCHOR: Get user from auth token
 * Checks token validity with firebase, then returns
 * corresponding db user instance
 * @param authToken
 */
export const getUserFromAuthToken = async (
  authToken: string,
) => {
  const userInfo = await firebaseAdmin
    .auth()
    .verifyIdToken(authToken);

  return getRepository(User)
    .findOne({ id: userInfo.uid });
};
