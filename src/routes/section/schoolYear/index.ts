// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateSchoolYearFromParams } from '../../../utils/middlewares/params/schoolYear';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../../utils/middlewares/validation';


// ANCHOR Controllers
import { createSection, getAllSections } from '../../../controllers/section';
import { getAllSectionsForSchoolYear } from '../../../controllers/schoolYear/sections';

// ANCHOR Schema
import { createUpdateSectionSchema } from '../../../models/payloads/schema/section';

// ANCHOR Payloads
import { sectionToFetchPayload } from '../../../models/payloads/section';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllSection } from '../../../utils/middlewares/cache/section';
import { getCacheAllSchoolYearSections, setCacheAllSchoolYearSections } from '../../../utils/middlewares/cache/schoolYear';

/* ANCHOR: Router export ---------------------------------------------------- */
export const sectionSchoolYearRouter = new Router({ prefix: '/school-year' });


/* ANCHOR: Create section ---------------------------------------------- */
sectionSchoolYearRouter.post(
  '/:schoolYearId',
  requireAdmin,
  setStateValidatedPayload(createUpdateSectionSchema),
  setStateSchoolYearFromParams('schoolYearId'),
  async (ctx) => {
    const { payload, schoolYear } = ctx.state;
    const newSection = await createSection(payload, schoolYear);

    ctx.status = status.OK;
    ctx.body = newSection;

    // Revalidate cache
    const result = await getAllSections();
    const parsedSection = result.map(sectionToFetchPayload);

    setCacheAllSection(parsedSection);
  },
);

/* ANCHOR: Get all sections for school year ---------------------------------------------------- */
sectionSchoolYearRouter.get(
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
