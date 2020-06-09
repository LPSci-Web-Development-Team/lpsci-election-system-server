// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import { Context } from 'koa';
import Router from 'koa-router';

// ANCHOR Errors
import { NotFoundError } from '../../errors/custom/NotFound';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../utils/middlewares/validationMiddlewares';

/* ANCHOR: Router export ---------------------------------------------------- */
export const userRouter = new Router({ prefix: '/user' });

/* ANCHOR: Get all users ---------------------------------------------------- */
userRouter.get(
  '/',
  async (ctx) => {
    const users = await getUsers();

    if (users) {
      ctx.status = status.OK;
      ctx.body = users.map(usersToFetchPayload);
    } else {
      ctx.status = status.NOT_FOUND;
    }
  },
);

/* ANCHOR: Get user by email ---------------------------------------------------- */
userRouter.get(
  '/user/:email',
  async (ctx) => {
    const { email } = ctx.params;

    const user = await getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(`User with email of ${email} does not exist.`);
    }

    ctx.status = status.OK;
    ctx.body = usersToFetchPayload(user);
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

/* ANCHOR: Update password handler ------------------------------------------ */
userRouter.post(
  '/update-password',
  requireSignIn,
  setStateValidatedPayload(updatePasswordSchema),
  async (ctx) => {
    const { user, payload } = ctx.state;
    await updatePassword(payload, user);
    ctx.status = status.OK;
  },
);

/* ANCHOR: Get user's provider account -------------------------------------- */
userRouter.get(
  '/provider-account',
  requireSignIn,
  async (ctx) => {
    const { user } = ctx.state;
    const providerAccount = await getUserProviderAccount(user);

    ctx.status = status.OK;
    ctx.body = providerAccount?.map(providerToFetchPayload);
  },
);


/* ANCHOR: Check if user is subscribed --------------------------------------- */
userRouter.get(
  '/check-subscribed/:providerId',
  requireSignIn,
  setStateProviderFromParams('providerId'),
  async (ctx) => {
    const { user, provider } = ctx.state;

    const isSubscribed = await userIsSubscribed(user, provider);

    ctx.status = status.OK;
    ctx.body = isSubscribed;
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

/* ANCHOR: Display photo router --------------------------------------------- */
const displayPhotoRouter = new Router({ prefix: '/display-photo' });

/* ANCHOR: Delete user display photo ---------------------------------------- */
displayPhotoRouter.delete(
  '/',
  requireSignIn,
  async (ctx: Context) => {
    const { user } = ctx.state;
    await deleteDisplayPhoto(user);
    ctx.status = status.NO_CONTENT;
  },
);

/* ANCHOR: Update user display photo ---------------------------------------- */
displayPhotoRouter.put(
  '/',
  requireSignIn,
  setStateValidatedPayload(updateDisplayPhotoSchema),
  async (ctx) => {
    const { user, payload } = ctx.state;
    await updateDisplayPhoto(user, payload);
    ctx.status = status.OK;
  },
);

/* ANCHOR: License router --------------------------------------------------- */
const licenseRouter = new Router({ prefix: '/router' });

/* ANCHOR: Create/Update license information -------------------------------- */
licenseRouter.put(
  '/',
  requireSignIn,
  setStateValidatedPayload(createUpdateLicenseSchema),
  async (ctx) => {
    const { user, payload } = ctx.state;
    await updateLicense(user, payload);
    ctx.status = status.OK;
  },
);

/* ANCHOR: Delete license information --------------------------------------- */
licenseRouter.delete(
  '/',
  requireSignIn,
  async (ctx: Context) => {
    const { user } = ctx.state;
    await deleteLicense(user);
    ctx.status = status.NO_CONTENT;
  },
);

// ANCHOR Merge sub router for user router
userRouter.use(
  // Merge display photo router
  displayPhotoRouter.routes(),
  displayPhotoRouter.allowedMethods(),

  // Merge license photo router
  licenseRouter.routes(),
  licenseRouter.allowedMethods(),
);
