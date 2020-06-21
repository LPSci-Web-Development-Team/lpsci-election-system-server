// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreatePartyPayload } from '../../models/payloads/party';

// ANCHOR Entities
import { Party } from '../../models/entities/Party';
import { SchoolYear } from '../../models/entities/SchoolYear';

/**
 * ANCHOR: Get all parties
 */
export const getAllParties = async () => (
  getRepository(Party)
    .find({
      order: {
        name: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get a party by id
 * @param id Party's id
 */
export const getPartyById = async (
  id: string,
) => (
  getRepository(Party)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Create a party
 *
 * @param payload Create party payload
 */
export const createParty = async (
  payload: ICreatePartyPayload,
  schoolYear: SchoolYear,
) => {
  const { name, color } = payload;

  const partyRepository = getRepository(Party);

  const newParty = partyRepository
    .create({
      name,
      color,
      schoolYear,
    });

  const party = await partyRepository
    .save(newParty);

  return party;
};

/**
 * ANCHOR: Update party
 *
 * @param payload Update party payload
 * @param currentParty Current party
 */
export const updateParty = async (
  payload: ICreatePartyPayload,
  currentParty: Party,
) => {
  const { name, color } = payload;

  const newParty = currentParty;
  newParty.name = name;
  newParty.color = color;

  const party = await getRepository(Party)
    .save(newParty);

  return party;
};

/**
 * ANCHOR: Delete party
 *
 * @param currentParty Current party
 */
export const deleteParty = async (
  currentParty: Party,
) => {
  await getRepository(Party)
    .remove(currentParty);
};
