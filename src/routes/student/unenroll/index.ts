// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import { Context } from 'koa';
import Router from 'koa-router';

// ANCHOR Controllers
import { unenrollStudent, getAllNotEnrolledStudents } from '../../../controllers/student/unenroll';

// ANCHOR Middlewares
import { requireSignIn, requireAdmin } from '../../../utils/middlewares/auth';
import { setStateStudentFromParams } from '../../../utils/middlewares/params/student';
import { getCacheAllNotEnrolledStudent, setCacheAllNotEnrolledStudent } from '../../../utils/middlewares/cache/student';

// ANCHOR Payloads
import { studentToFetchPayload } from '../../../models/payloads/student';

/* ANCHOR: Enroll student router --------------------------------------------- */
export const unenrollStudentRouter = new Router({ prefix: '/unenroll' });

/* ANCHOR: Get all unenrolled students ---------------------------------------------------- */
unenrollStudentRouter.get(
  '/',
  requireAdmin,
  getCacheAllNotEnrolledStudent,
  async (ctx) => {
    const { notEnrolledStudents } = ctx.state.cache;

    if (notEnrolledStudents) {
      ctx.status = status.OK;
      ctx.body = notEnrolledStudents;
    } else {
      const result = await getAllNotEnrolledStudents();
      const parsedStudent = result.map(studentToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedStudent;
        // Set cache
        setCacheAllNotEnrolledStudent(parsedStudent);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Unenroll a student ---------------------------------------- */
unenrollStudentRouter.put(
  '/',
  requireSignIn,
  setStateStudentFromParams('studentId'),
  async (ctx: Context) => {
    const { student } = ctx.state;

    const unenrolledStudent = await unenrollStudent(student);

    ctx.status = status.OK;
    ctx.body = studentToFetchPayload(unenrolledStudent);

    // Revalidate cache
    const result = await getAllNotEnrolledStudents();
    const parsedStudent = result.map(studentToFetchPayload);

    setCacheAllNotEnrolledStudent(parsedStudent);
  },
);
