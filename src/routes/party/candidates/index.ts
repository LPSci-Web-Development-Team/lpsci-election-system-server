// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Utils
import { setStatePartyFromParams } from '../../../utils/middlewares/params/party';

// ANCHOR Controllers
import { getAllCandidatesForParty } from '../../../controllers/party/candidates/index';

// ANCHOR Payloads
import { candidateToFetchPayload } from '../../../models/payloads/candidate';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import {
  setCacheAllPartyCandidates,
  getCacheAllPartyCandidates,
} from '../../../utils/middlewares/cache/party';

/* ANCHOR: Router export ---------------------------------------------------- */
export const partyCandidateRouter = new Router({ prefix: '/candidates' });

/* ANCHOR: Get all parties ---------------------------------------------------- */
partyCandidateRouter.get(
  '/',
  requireAdmin,
  getCacheAllPartyCandidates('partyId'),
  setStatePartyFromParams('partyId'),
  async (ctx) => {
    const { partyCandidates } = ctx.state.cache;

    if (partyCandidates) {
      ctx.status = status.OK;
      ctx.body = partyCandidates;
    } else {
      const { party } = ctx.state;

      const result = await getAllCandidatesForParty(party);
      const parsedCandidate = result.map(candidateToFetchPayload);

      if (result) {
        const { partyId } = ctx.params;

        ctx.status = status.OK;
        ctx.body = parsedCandidate;
        // Set cache
        setCacheAllPartyCandidates(parsedCandidate, partyId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
