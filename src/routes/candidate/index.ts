// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Utils
import { setStateCandidateFromParams } from '../../utils/middlewares/params/candidate';

// ANCHOR Controllers
import {
  getAllCandidates, getCandidateById, deleteCandidate,
} from '../../controllers/candidate';

// ANCHOR Schema

// ANCHOR Payloads
import { candidateToFetchPayload } from '../../models/payloads/candidate';

// ANCHOR Middlewares
import { requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllCandidate, getCacheAllCandidate, getCacheCandidate, setCacheCandidate,
} from '../../utils/middlewares/cache/candidate';

// ANCHOR Routes
import { candidateStudentRouter } from './student';

/* ANCHOR: Router export ---------------------------------------------------- */
export const candidateRouter = new Router({ prefix: '/candidate' });

/* ANCHOR: Get all candidates ---------------------------------------------------- */
candidateRouter.get(
  '/',
  requireAdmin,
  getCacheAllCandidate,
  async (ctx) => {
    const { candidates } = ctx.state.cache;

    if (candidates) {
      ctx.status = status.OK;
      ctx.body = candidates;
    } else {
      const result = await getAllCandidates();
      const parsedCandidate = result.map(candidateToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedCandidate;
        // Set cache
        setCacheAllCandidate(parsedCandidate);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get candidate by id ---------------------------------------------------- */
candidateRouter.get(
  '/:candidateId',
  requireAdmin,
  getCacheCandidate('candidateId'),
  async (ctx) => {
    const { candidate } = ctx.state.cache;

    if (candidate) {
      ctx.status = status.OK;
      ctx.body = candidate;
    } else {
      const { candidateId } = ctx.params;

      const result = await getCandidateById(candidateId);

      if (result) {
        const parsedCandidate = candidateToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedCandidate;
        // Set cache
        setCacheCandidate(candidateId, parsedCandidate);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Delete candidate ---------------------------------------------- */
candidateRouter.delete(
  '/:candidateId',
  requireAdmin,
  setStateCandidateFromParams('candidateId'),
  async (ctx) => {
    const { candidate } = ctx.state;
    const newStudent = await deleteCandidate(candidate);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllCandidates();
    const parsedCandidate = result.map(candidateToFetchPayload);

    setCacheAllCandidate(parsedCandidate);
  },
);

// ANCHOR Merge sub router for candidate router
candidateRouter.use(
  '/:candidateId',
  // Merge display photo router
  candidateStudentRouter.routes(),
  candidateStudentRouter.allowedMethods(),
);
