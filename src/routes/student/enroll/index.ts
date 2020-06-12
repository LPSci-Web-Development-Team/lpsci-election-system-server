// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import { Context } from 'koa';
import Router from 'koa-router';

// ANCHOR Controllers
import { enrollStudent, getAllEnrolledStudents } from '../../../controllers/student/enroll';

// ANCHOR Middlewares
import { requireSignIn, requireAdmin } from '../../../utils/middlewares/auth';
import { setStateStudentFromParams } from '../../../utils/middlewares/params/student';
import { getCacheAllEnrolledStudent, setCacheAllEnrolledStudent } from '../../../utils/middlewares/cache/student';

// ANCHOR Payloads
import { studentToFetchPayload } from '../../../models/payloads/student';

/* ANCHOR: Enroll student router --------------------------------------------- */
export const enrollStudentRouter = new Router({ prefix: '/enroll' });

/* ANCHOR: Get all enrolled students ---------------------------------------------------- */
enrollStudentRouter.get(
  '/',
  requireAdmin,
  getCacheAllEnrolledStudent,
  async (ctx) => {
    const { enrolledStudents } = ctx.state.cache;

    if (enrolledStudents) {
      ctx.status = status.OK;
      ctx.body = enrolledStudents;
    } else {
      const result = await getAllEnrolledStudents();
      const parsedStudent = result.map(studentToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedStudent;
        // Set cache
        setCacheAllEnrolledStudent(parsedStudent);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Enroll a student ---------------------------------------- */
enrollStudentRouter.put(
  '/',
  requireSignIn,
  setStateStudentFromParams('studentId'),
  async (ctx: Context) => {
    const { student } = ctx.state;

    const enrolledStudent = await enrollStudent(student);

    ctx.status = status.OK;
    ctx.body = studentToFetchPayload(enrolledStudent);

    // Revalidate cache
    const result = await getAllEnrolledStudents();
    const parsedStudent = result.map(studentToFetchPayload);

    setCacheAllEnrolledStudent(parsedStudent);
  },
);
