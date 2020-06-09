// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR HTTP Codes
import * as status from 'http-status-codes';

// ANCHOR Middlewares

// ANCHOR Errors
import { catchResponseError } from '../utils/catchResponseError';

/* ANCHOR: Router imports --------------------------------------------------- */

/* ANCHOR: List of routers -------------------------------------------------- */
const routes: Router[] = [];

/* ANCHOR: Router consolidation --------------------------------------------- */
export function getRootRouter(): Router {
  const root = new Router()

    // Formats errors thrown in the promise chain
    .use(catchResponseError);

  // Adds current user to state store
  // TODO Add this .use(setStateUser);

  // NOTE: Root should always return OK for status checks
  root.get('/', (ctx) => {
    ctx.status = status.OK;
  });

  routes.forEach((route) => {
    root.use(route.routes());
  });

  return root;
}
