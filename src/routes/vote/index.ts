// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Controllers
import {
  getAllVotes, getVoteById, createVote,
} from '../../controllers/vote';

// ANCHOR Payloads
import { voteToFetchPayload } from '../../models/payloads/vote';

// ANCHOR Middlewares
import { requireSignIn, requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllVote, setCacheVote, getCacheAllVote, getCacheVote,
} from '../../utils/middlewares/cache/vote';
import { setStateStudentFromParams } from '../../utils/middlewares/params/student';
import { setStateCandidateFromParams } from '../../utils/middlewares/params/candidate';

/* ANCHOR: Router export ---------------------------------------------------- */
export const voteRouter = new Router({ prefix: '/vote' });

/* ANCHOR: Get all votes ---------------------------------------------------- */
voteRouter.get(
  '/',
  requireAdmin,
  getCacheAllVote,
  async (ctx) => {
    const { votes } = ctx.state.cache;

    if (votes) {
      ctx.status = status.OK;
      ctx.body = votes;
    } else {
      const result = await getAllVotes();
      const parsedVote = result.map(voteToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedVote;
        // Set cache
        setCacheAllVote(parsedVote);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get vote by id ---------------------------------------------------- */
voteRouter.get(
  '/:voteId',
  requireSignIn,
  getCacheVote('voteId'),
  async (ctx) => {
    const { vote } = ctx.state.cache;

    if (vote) {
      ctx.status = status.OK;
      ctx.body = vote;
    } else {
      const { voteId } = ctx.params;

      const result = await getVoteById(voteId);

      if (result) {
        const parsedVote = voteToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedVote;
        // Set cache
        setCacheVote(voteId, parsedVote);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);


/* ANCHOR: Create vote ---------------------------------------------- */
voteRouter.post(
  '/:candidateId/by/:studentId',
  requireSignIn,
  setStateCandidateFromParams('candidateId'),
  setStateStudentFromParams('studentId'),
  async (ctx) => {
    const { candidate, student } = ctx.state;
    const newVote = await createVote(candidate, student);

    ctx.status = status.CREATED;
    ctx.body = newVote;

    // Revalidate cache
    const result = await getAllVotes();
    const parsedVote = result.map(voteToFetchPayload);

    setCacheAllVote(parsedVote);
  },
);
