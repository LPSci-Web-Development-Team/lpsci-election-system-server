// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateSchoolYearFromParams } from '../../../utils/middlewares/params/schoolYear';

// ANCHOR Controllers
import { getAllSectionsForSchoolYear } from '../../../controllers/schoolYear/sections';

// ANCHOR Schema

// ANCHOR Payloads
import { sectionToFetchPayload } from '../../../models/payloads/section';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllSchoolYearSections, getCacheAllSchoolYearSections } from '../../../utils/middlewares/cache/schoolYear';

/* ANCHOR: Router export ---------------------------------------------------- */
export const schoolYearSectionRouter = new Router({ prefix: '/sections' });

/* ANCHOR: Get all sections for school year ---------------------------------------------------- */
schoolYearSectionRouter.get(
  '/:schoolYearId',
  requireAdmin,
  getCacheAllSchoolYearSections('schoolYearId'),
  setStateSchoolYearFromParams('schoolYearId'),
  async (ctx) => {
    const { schoolYearSections } = ctx.state.cache;

    if (schoolYearSections) {
      ctx.status = status.OK;
      ctx.body = schoolYearSections;
    } else {
      const { schoolYear } = ctx.state;

      const result = await getAllSectionsForSchoolYear(schoolYear);
      const parsedSection = result.map(sectionToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedSection;
        // Set cache
        const { schoolYearId } = ctx.params;

        setCacheAllSchoolYearSections(parsedSection, schoolYearId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
