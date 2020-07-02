// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateStudentFromParams } from '../../../utils/middlewares/params/student';

// ANCHOR Controllers
import { getAllVotesForStudent } from '../../../controllers/student/votes';

// ANCHOR Payloads
import { voteToFetchPayload } from '../../../models/payloads/vote';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllStudentVotes } from '../../../utils/middlewares/cache/student';

/* ANCHOR: Router export ---------------------------------------------------- */
export const studentVoteRouter = new Router({ prefix: '/votes' });

/* ANCHOR: Get all votes for student ---------------------------------------------------- */
studentVoteRouter.get(
  '/:studentId',
  requireAdmin,
  // getCacheAllStudentVotes('studentId'),
  setStateStudentFromParams('studentId'),
  async (ctx) => {
    const { studentVotes } = ctx.state.cache;
    if (studentVotes) {
      ctx.status = status.OK;
      ctx.body = studentVotes;
    } else {
      const { student } = ctx.state;

      const result = await getAllVotesForStudent(student);
      const parsedVote = result.map(voteToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedVote;
        // Set cache
        const { studentId } = ctx.params;

        setCacheAllStudentVotes(parsedVote, studentId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
