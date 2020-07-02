
// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateSectionFromParams } from '../../../utils/middlewares/params/section';

// ANCHOR Controllers
import { getAllStudentForSection } from '../../../controllers/section/students';

// ANCHOR Payloads
import { studentToFetchPayload } from '../../../models/payloads/student';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllSectionStudents } from '../../../utils/middlewares/cache/section';


/* ANCHOR: Router export ---------------------------------------------------- */
export const sectionStudentsRouter = new Router({ prefix: '/students' });


/* ANCHOR: Get all students for section ---------------------------------------------------- */
sectionStudentsRouter.get(
  '/',
  requireAdmin,
  // getCacheAllSectionStudents('sectionId'),
  setStateSectionFromParams('sectionId'),
  async (ctx) => {
    const { sectionStudents } = ctx.state.cache;
    const { section } = ctx.state;
    const { sectionId } = ctx.params;

    if (sectionStudents) {
      ctx.status = status.OK;
      ctx.body = sectionStudents;
    } else {
      const result = await getAllStudentForSection(section);
      const parsedSection = result.map(studentToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedSection;
        // Set cache
        setCacheAllSectionStudents(parsedSection, sectionId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
