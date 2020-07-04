// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR HTTP Status Codes
import * as status from 'http-status-codes';

// ANCHOR Middleware
import { setStateStudentFromParams } from '../../../utils/middlewares/params/student';
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setStateCandidateFromParams } from '../../../utils/middlewares/params/candidate';
import { setStateValidatedPayload } from '../../../utils/middlewares/validation';
import { setCacheAllCandidate } from '../../../utils/middlewares/cache/candidate';

// ANCHOR Schema
import { createUpdateCandidateSchema } from '../../../models/payloads/schema/candidate';

// ANCHOR Controllers
import { updateCandidate, createCandidate } from '../../../controllers/candidate/student';
import { getAllCandidates } from '../../../controllers/candidate';

// ANCHOR Payload
import { candidateToFetchPayload } from '../../../models/payloads/candidate';

/* ANCHOR: Router export ---------------------------------------------------- */
export const candidateStudentRouter = new Router({ prefix: '/student' });

/* ANCHOR: Create candidate ---------------------------------------------- */
candidateStudentRouter.post(
  '/:studentId',
  requireAdmin,
  setStateStudentFromParams('studentId'),
  setStateValidatedPayload(createUpdateCandidateSchema),
  async (ctx) => {
    const { student, payload } = ctx.state;
    const newCandidate = await createCandidate(payload, student);

    ctx.status = status.CREATED;
    ctx.body = newCandidate;

    // Revalidate cache
    const result = await getAllCandidates();
    const parsedCandidate = result.map(candidateToFetchPayload);

    setCacheAllCandidate(parsedCandidate);
  },
);
/* ANCHOR: Update candidate ---------------------------------------------- */
candidateStudentRouter.put(
  '/:studentId',
  requireAdmin,
  setStateCandidateFromParams('candidateId'),
  setStateStudentFromParams('studentId'),
  setStateValidatedPayload(createUpdateCandidateSchema),
  async (ctx) => {
    const { candidate, student, payload } = ctx.state;
    const newCandidate = await updateCandidate(payload, student, candidate);

    ctx.status = status.OK;
    ctx.body = newCandidate;

    // Revalidate cache
    const result = await getAllCandidates();
    const parsedCandidate = result.map(candidateToFetchPayload);

    setCacheAllCandidate(parsedCandidate);
  },
);
