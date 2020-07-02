// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import { Context } from 'koa';
import Router from 'koa-router';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../utils/middlewares/validation';

// ANCHOR Controllers
import {
  getUsers, getUserByEmail, createUser, updateUser,
} from '../../controllers/user';

// ANCHOR Schema
import { signUpSchema, updateUserSchema } from '../../models/payloads/schema/user';

// ANCHOR Payloads
import { userToFetchPayload } from '../../models/payloads/user';

// ANCHOR Routes
import { displayPhotoRouter } from './display-photo';

// ANCHOR Middlewares
import { requireSignIn, requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllUser, setCacheUser, getCacheAllUser, getCacheUser,
} from '../../utils/middlewares/cache/user';


/* ANCHOR: Router export ---------------------------------------------------- */
export const userRouter = new Router({ prefix: '/user' });

/* ANCHOR: Get all users ---------------------------------------------------- */
userRouter.get(
  '/',
  requireAdmin,
  getCacheAllUser,
  async (ctx) => {
    const { users } = ctx.state.cache;

    if (users) {
      ctx.status = status.OK;
      ctx.body = users;
    } else {
      const result = await getUsers();
      const parsedUser = result.map(userToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedUser;
        // Set cache
        setCacheAllUser(parsedUser);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get user by email ---------------------------------------------------- */
userRouter.get(
  '/:email',
  requireAdmin,
  getCacheUser('email'),
  async (ctx) => {
    const { user } = ctx.state.cache;

    if (user) {
      ctx.status = status.OK;
      ctx.body = user;
    } else {
      const { email } = ctx.params;

      const result = await getUserByEmail(email);

      if (result) {
        const parsedUser = userToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedUser;
        // Set cache
        setCacheUser(email, parsedUser);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Sign up handler -------------------------------------------------- */
userRouter.post(
  '/',
  setStateValidatedPayload(signUpSchema),
  async (ctx: Context) => {
    const { payload } = ctx.state;
    const user = await createUser(payload);

    ctx.status = status.CREATED;
    ctx.body = user;

    // Revalidate cache
    const result = await getUsers();
    const parsedUser = result.map(userToFetchPayload);

    setCacheAllUser(parsedUser);
  },
);

/* ANCHOR: Update user handler ---------------------------------------------- */
userRouter.put(
  '/',
  requireSignIn,
  setStateValidatedPayload(updateUserSchema),
  async (ctx) => {
    const { user, payload } = ctx.state;
    const newUser = await updateUser(payload, user);

    ctx.status = status.OK;
    ctx.body = newUser;

    // Revalidate cache
    const result = await getUsers();
    const parsedUser = result.map(userToFetchPayload);

    setCacheAllUser(parsedUser);
  },
);

/* ANCHOR: Check if user is an admin ----------------------------------------- */
userRouter.get(
  '/admin',
  requireAdmin,
  (ctx) => {
    ctx.status = status.OK;
    ctx.body = true;
  },
);

// ANCHOR Merge sub router for user router
userRouter.use(
  // Merge display photo router
  displayPhotoRouter.routes(),
  displayPhotoRouter.allowedMethods(),
);
