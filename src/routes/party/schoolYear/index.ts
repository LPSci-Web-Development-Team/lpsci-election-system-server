// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { setStateSchoolYearFromParams } from '../../../utils/middlewares/params/schoolYear';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../../utils/middlewares/validation';

// ANCHOR Controllers
import { createParty, getAllParties } from '../../../controllers/party';

// ANCHOR Schema
import { createUpdatePartySchema } from '../../../models/payloads/schema/party';

// ANCHOR Payloads
import { partyToFetchPayload } from '../../../models/payloads/party';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import { setCacheAllParty } from '../../../utils/middlewares/cache/party';

/* ANCHOR: Router export ---------------------------------------------------- */
export const partySchoolYearRouter = new Router({ prefix: '/school-year' });

/* ANCHOR: Create party ---------------------------------------------- */
partySchoolYearRouter.post(
  '/:schoolYearId',
  requireAdmin,
  setStateValidatedPayload(createUpdatePartySchema),
  setStateSchoolYearFromParams('schoolYearId'),
  async (ctx) => {
    const { payload, schoolYear } = ctx.state;
    const newParty = await createParty(payload, schoolYear);

    ctx.status = status.OK;
    ctx.body = newParty;

    // Revalidate cache
    const result = await getAllParties();
    const parsedParty = result.map(partyToFetchPayload);

    setCacheAllParty(parsedParty);
  },
);
