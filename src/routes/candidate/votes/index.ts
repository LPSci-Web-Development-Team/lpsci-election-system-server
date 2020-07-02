// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateCandidateFromParams } from '../../../utils/middlewares/params/candidate';

// ANCHOR Controllers
import { getAllVotesForCandidate } from '../../../controllers/candidate/votes';

// ANCHOR Payloads
import { voteToFetchPayload } from '../../../models/payloads/vote';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllCandidateVotes, getCacheAllCandidateVotes } from '../../../utils/middlewares/cache/candidate';

/* ANCHOR: Router export ---------------------------------------------------- */
export const candidateVoteRouter = new Router({ prefix: '/votes' });

/* ANCHOR: Get all votes for candidate ---------------------------------------------------- */
candidateVoteRouter.get(
  '/:candidateId',
  requireAdmin,
  getCacheAllCandidateVotes('candidateId'),
  setStateCandidateFromParams('candidateId'),
  async (ctx) => {
    const { candidateVotes } = ctx.state.cache;
    if (candidateVotes) {
      ctx.status = status.OK;
      ctx.body = candidateVotes;
    } else {
      const { candidate } = ctx.state;

      const result = await getAllVotesForCandidate(candidate);
      const parsedVote = result.map(voteToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedVote;
        // Set cache
        const { candidateId } = ctx.params;

        setCacheAllCandidateVotes(parsedVote, candidateId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
