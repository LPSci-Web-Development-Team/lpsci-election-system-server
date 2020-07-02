/**
 * ANCHOR: Sets a blank cache when no cache existed yet.
 *
 * @param ctx Koa context
 * @param next Next middleware
 */
export const setCache = async (
  ctx: any,
  next: () => Promise<any>,
) => {
  if (typeof ctx.state.cache === 'undefined') {
    ctx.state.cache = {};
  }

  return next();
};
