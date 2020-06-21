// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateSchoolYearFromParams } from '../../../utils/middlewares/params/schoolYear';

// ANCHOR Controllers
import { getAllPartiesForSchoolYear } from '../../../controllers/schoolYear/parties';

// ANCHOR Schema

// ANCHOR Payloads
import { partyToFetchPayload } from '../../../models/payloads/party';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { getCacheAllSchoolYearParties, setCacheAllSchoolYearParties } from '../../../utils/middlewares/cache/schoolYear';

/* ANCHOR: Router export ---------------------------------------------------- */
export const schoolYearPartyRouter = new Router({ prefix: '/parties' });

/* ANCHOR: Get all parties for school year ---------------------------------------------------- */
schoolYearPartyRouter.get(
  '/:schoolYearId',
  requireAdmin,
  getCacheAllSchoolYearParties('schoolYearId'),
  setStateSchoolYearFromParams('schoolYearId'),
  async (ctx) => {
    const { parties } = ctx.state.cache;
    const { schoolYear } = ctx.state;
    const { schoolYearId } = ctx.params;

    if (parties) {
      ctx.status = status.OK;
      ctx.body = parties;
    } else {
      const result = await getAllPartiesForSchoolYear(schoolYear);
      const parsedParty = result.map(partyToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedParty;
        // Set cache
        setCacheAllSchoolYearParties(parsedParty, schoolYearId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);
