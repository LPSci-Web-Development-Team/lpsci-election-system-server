// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Utils
import { setStatePartyFromParams } from '../../utils/middlewares/params/party';

// ANCHOR Controllers
import {
  getAllParties, getPartyById, deleteParty, createParty, updateParty,
} from '../../controllers/party';

// ANCHOR Schema
import { createUpdatePartySchema } from '../../models/payloads/schema/party';

// ANCHOR Payloads
import { partyToFetchPayload } from '../../models/payloads/party';

// ANCHOR Middlewares
import { setStateValidatedPayload } from '../../utils/middlewares/validation';
import { requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllParty, getCacheAllParty, getCacheParty, setCacheParty,
} from '../../utils/middlewares/cache/party';

// ANCHOR Routes
import { partyCandidateRouter } from './candidates';
import { partySchoolYearRouter } from './schoolYear';

/* ANCHOR: Router export ---------------------------------------------------- */
export const partyRouter = new Router({ prefix: '/party' });

/* ANCHOR: Get all parties ---------------------------------------------------- */
partyRouter.get(
  '/',
  requireAdmin,
  getCacheAllParty,
  async (ctx) => {
    const { parties } = ctx.state.cache;

    if (parties) {
      ctx.status = status.OK;
      ctx.body = parties;
    } else {
      const result = await getAllParties();
      const parsedParty = result.map(partyToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedParty;
        // Set cache
        setCacheAllParty(parsedParty);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get party by id ---------------------------------------------------- */
partyRouter.get(
  '/:partyId',
  requireAdmin,
  getCacheParty('partyId'),
  async (ctx) => {
    const { party } = ctx.state.cache;

    if (party) {
      ctx.status = status.OK;
      ctx.body = party;
    } else {
      const { partyId } = ctx.params;

      const result = await getPartyById(partyId);

      if (result) {
        const parsedParty = partyToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedParty;
        // Set cache
        setCacheParty(partyId, parsedParty);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Update party ---------------------------------------------- */
partyRouter.put(
  '/:partyId',
  requireAdmin,
  setStatePartyFromParams('partyId'),
  setStateValidatedPayload(createUpdatePartySchema),
  async (ctx) => {
    const { party, payload } = ctx.state;
    const newParty = await updateParty(payload, party);

    ctx.status = status.OK;
    ctx.body = newParty;

    // Revalidate cache
    const result = await getAllParties();
    const parsedParty = result.map(partyToFetchPayload);

    setCacheAllParty(parsedParty);
  },
);

/* ANCHOR: Delete party ---------------------------------------------- */
partyRouter.delete(
  '/:partyId',
  requireAdmin,
  setStatePartyFromParams('partyId'),
  async (ctx) => {
    const { party } = ctx.state;
    const newParty = await deleteParty(party);

    ctx.status = status.OK;
    ctx.body = newParty;

    // Revalidate cache
    const result = await getAllParties();
    const parsedParty = result.map(partyToFetchPayload);

    setCacheAllParty(parsedParty);
  },
);

// ANCHOR Merge sub router for party router
partyRouter.use(
  '/:partyId',
  // Merge candidate router
  partyCandidateRouter.routes(),
  partyCandidateRouter.allowedMethods(),
  // Merge school year router
  partySchoolYearRouter.routes(),
  partySchoolYearRouter.allowedMethods(),
);
