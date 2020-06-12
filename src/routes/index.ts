// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR HTTP Codes
import * as status from 'http-status-codes';

// ANCHOR Middlewares
import { setStateUser } from '../utils/middlewares/auth';

// ANCHOR Errors
import { catchResponseError } from '../utils/catchResponseError';

/* ANCHOR: Router imports --------------------------------------------------- */
import { userRouter } from './user';
import { studentRouter } from './student';

/* ANCHOR: List of routers -------------------------------------------------- */
const routes: Router[] = [
  userRouter,
  studentRouter,
];

/* ANCHOR: Router consolidation --------------------------------------------- */
export function getRootRouter(): Router {
  const root = new Router()

    // Formats errors thrown in the promise chain
    .use(catchResponseError)

    // Adds current user to state store
    .use(setStateUser);

  // NOTE: Root should always return OK for status checks
  root.get('/', (ctx) => {
    ctx.status = status.OK;
  });

  routes.forEach((route) => {
    root.use(route.routes());
  });

  return root;
}
