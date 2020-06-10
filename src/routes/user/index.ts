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

/* ANCHOR: Router export ---------------------------------------------------- */
export const userRouter = new Router({ prefix: '/user' });

/* ANCHOR: Get all users ---------------------------------------------------- */
userRouter.get(
  '/',
  requireAdmin,
  async (ctx) => {
    const users = await getUsers();

    if (users) {
      ctx.status = status.OK;
      ctx.body = users.map(userToFetchPayload);
    } else {
      ctx.status = status.NOT_FOUND;
    }
  },
);

/* ANCHOR: Get user by email ---------------------------------------------------- */
userRouter.get(
  '/user/:email',
  requireAdmin,
  async (ctx) => {
    const { email } = ctx.params;

    const user = await getUserByEmail(email);

    if (user) {
      ctx.status = status.OK;
      ctx.body = userToFetchPayload(user);
    } else {
      ctx.status = status.NOT_FOUND;
    }
  },
);

/* ANCHOR: Sign up handler -------------------------------------------------- */
userRouter.post(
  '/sign-up',
  setStateValidatedPayload(signUpSchema),
  async (ctx: Context) => {
    const { payload } = ctx.state;
    const user = await createUser(payload);

    ctx.status = status.CREATED;
    ctx.body = user;
  },
);

/* ANCHOR: Update user handler ---------------------------------------------- */
userRouter.post(
  '/update-user',
  requireSignIn,
  setStateValidatedPayload(updateUserSchema),
  async (ctx) => {
    const { user, payload } = ctx.state;
    const newUser = await updateUser(payload, user);

    ctx.status = status.OK;
    ctx.body = newUser;
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
