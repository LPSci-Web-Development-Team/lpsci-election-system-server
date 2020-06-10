// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import { Context } from 'koa';
import Router from 'koa-router';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../../utils/middlewares/validation';

// ANCHOR Controllers
import { deleteDisplayPhoto, updateDisplayPhoto } from '../../../controllers/user/display-photo';

// ANCHOR Schemas
import { updateDisplayPhotoSchema } from '../../../models/payloads/schema/user';

// ANCHOR Middlewares
import { requireSignIn } from '../../../utils/middlewares/auth';

/* ANCHOR: Display photo router --------------------------------------------- */
export const displayPhotoRouter = new Router({ prefix: '/display-photo' });

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
