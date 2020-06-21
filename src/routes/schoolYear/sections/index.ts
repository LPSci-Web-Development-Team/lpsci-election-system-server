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
import { getCacheAllSchoolYearSections, setCacheAllSchoolYearSections } from '../../../utils/middlewares/cache/schoolYear';

/* ANCHOR: Router export ---------------------------------------------------- */
export const schoolYearSectionRouter = new Router({ prefix: '/sections' });

/* ANCHOR: Get all sections for school year ---------------------------------------------------- */
schoolYearSectionRouter.get(
  '/:schoolYearId',
  requireAdmin,
  getCacheAllSchoolYearSections('schoolYearId'),
  setStateSchoolYearFromParams('schoolYearId'),
  async (ctx) => {
    const { sections } = ctx.state.cache;
    const { schoolYear } = ctx.state;
    const { schoolYearId } = ctx.params;

    if (sections) {
      ctx.status = status.OK;
      ctx.body = sections;
    } else {
      const result = await getAllSectionsForSchoolYear(schoolYear);
      const parsedSection = result.map(sectionToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedSection;
        // Set cache
        setCacheAllSchoolYearSections(parsedSection, schoolYearId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
