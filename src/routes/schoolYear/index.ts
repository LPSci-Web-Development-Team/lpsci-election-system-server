// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../utils/middlewares/validation';
import { setStateSchoolYearFromParams } from '../../utils/middlewares/params/schoolYear';

// ANCHOR Controllers
import {
  getAllSchoolYears, getSchoolYearById, createSchoolYear, updateSchoolYear,
} from '../../controllers/schoolYear';

// ANCHOR Schema
import { createUpdateSchoolYearSchema } from '../../models/payloads/schema/schoolYear';

// ANCHOR Payloads
import { schoolYearToFetchPayload } from '../../models/payloads/schoolYear';

// ANCHOR Middlewares
import { requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllSchoolYear, getCacheAllSchoolYear, getCacheSchoolYear, setCacheSchoolYear,
} from '../../utils/middlewares/cache/schoolYear';

// ANCHOR Routers
import { schoolYearSectionRouter } from './sections';
import { schoolYearPartyRouter } from './parties';

/* ANCHOR: Router export ---------------------------------------------------- */
export const schoolYearRouter = new Router({ prefix: '/school-year' });

/* ANCHOR: Get all schoolYears ---------------------------------------------------- */
schoolYearRouter.get(
  '/',
  requireAdmin,
  getCacheAllSchoolYear,
  async (ctx) => {
    const { schoolYears } = ctx.state.cache;

    if (schoolYears) {
      ctx.status = status.OK;
      ctx.body = schoolYears;
    } else {
      const result = await getAllSchoolYears();
      const parsedSchoolYear = result.map(schoolYearToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedSchoolYear;
        // Set cache
        setCacheAllSchoolYear(parsedSchoolYear);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get schoolYear by id ---------------------------------------------------- */
schoolYearRouter.get(
  '/:schoolYearId',
  requireAdmin,
  getCacheSchoolYear('schoolYearId'),
  async (ctx) => {
    const { schoolYear } = ctx.state.cache;

    if (schoolYear) {
      ctx.status = status.OK;
      ctx.body = schoolYear;
    } else {
      const { schoolYearId } = ctx.params;

      const result = await getSchoolYearById(schoolYearId);

      if (result) {
        const parsedSchoolYear = schoolYearToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedSchoolYear;
        // Set cache
        setCacheSchoolYear(schoolYearId, parsedSchoolYear);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);


/* ANCHOR: Create schoolYear ---------------------------------------------- */
schoolYearRouter.post(
  '/:schoolYearId',
  requireAdmin,
  setStateValidatedPayload(createUpdateSchoolYearSchema),
  async (ctx) => {
    const { payload } = ctx.state;
    const newSchoolYear = await createSchoolYear(payload);

    ctx.status = status.OK;
    ctx.body = newSchoolYear;

    // Revalidate cache
    const result = await getAllSchoolYears();
    const parsedSchoolYear = result.map(schoolYearToFetchPayload);

    setCacheAllSchoolYear(parsedSchoolYear);
  },
);

/* ANCHOR: Update schoolYear ---------------------------------------------- */
schoolYearRouter.put(
  '/:schoolYearId',
  requireAdmin,
  setStateSchoolYearFromParams('schoolYearId'),
  setStateValidatedPayload(createUpdateSchoolYearSchema),
  async (ctx) => {
    const { schoolYear, payload } = ctx.state;
    const newSchoolYear = await updateSchoolYear(payload, schoolYear);

    ctx.status = status.OK;
    ctx.body = newSchoolYear;

    // Revalidate cache
    const result = await getAllSchoolYears();
    const parsedSchoolYear = result.map(schoolYearToFetchPayload);

    setCacheAllSchoolYear(parsedSchoolYear);
  },
);

// ANCHOR Merge sub router for school year router
schoolYearRouter.use(
  '/:partyId',
  // Merge section router
  schoolYearSectionRouter.routes(),
  schoolYearSectionRouter.allowedMethods(),
  // Merge party router
  schoolYearPartyRouter.routes(),
  schoolYearPartyRouter.allowedMethods(),
);
