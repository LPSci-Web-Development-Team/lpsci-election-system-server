// ANCHOR Controller
import { getPartyById } from '../../../controllers/party';

// ANCHOR Errors
import { NotFoundError } from '../../../errors/custom/NotFound';

/**
 * ANCHOR: Set state party from params middleware:
 * Fetches party from context parameters given param name;
 * Returns middleware that injects fetched party in state;
 * Request will fail with a not found error if party cannot be found.
 *
 * @param ctxParamName URL parameter name for party ID
 */
export const setStatePartyFromParams = (ctxParamName: string) => (
  async function setStateParty(ctx: any, next: () => Promise<any>) {
    const partyId = ctx.params[ctxParamName];
    const party = await getPartyById(partyId);

    if (!party) {
      throw new NotFoundError(`Party with ID ${partyId} could not be found`);
    }

    ctx.state.party = party;
    return next();
  }
);
