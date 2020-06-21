// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateSchoolYearFromParams } from '../../../utils/middlewares/params/schoolYear';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../../utils/middlewares/validation';

// ANCHOR Controllers
import { createSection, getAllSections } from '../../../controllers/section';

// ANCHOR Schema
import { createUpdateSectionSchema } from '../../../models/payloads/schema/section';

// ANCHOR Payloads
import { sectionToFetchPayload } from '../../../models/payloads/section';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllSection } from '../../../utils/middlewares/cache/section';

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
