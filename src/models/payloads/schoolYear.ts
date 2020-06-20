import { SchoolYear } from '../entities/SchoolYear';
import { IFetchSectionPayload, sectionToFetchPayload } from './section';
import { IFetchPartyPayload, partyToFetchPayload } from './party';

export interface ICreateSchoolYearPayload {
  readonly year: string;
}

export interface IFetchSchoolYearPayload {
  readonly id: string;
  readonly year: string;
  sections?: IFetchSectionPayload[];
  readonly parties?: IFetchPartyPayload[];
}

export const schoolYearToFetchPayload = (
  schoolYear: SchoolYear,
): IFetchSchoolYearPayload => {
  const {
    id,
    year,
    sections,
    parties,
  } = schoolYear;

  return {
    id,
    year,
    sections: sections && sections.map(sectionToFetchPayload),
    parties: parties && parties.map(partyToFetchPayload),
  };
};
