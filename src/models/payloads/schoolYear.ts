import { SchoolYear } from '../entities/SchoolYear';

export interface ICreateSchoolYearPayload {
  readonly year: string;
}

export interface IFetchSchoolYearPayload {
  readonly id: string;
  readonly year: string;
  // readonly sections?: IFetchSectionPayload[];
  // readonly parties?: IFetchPartyPayload[];
}

export const schoolYearToFetchPayload = (
  schoolYear: SchoolYear,
) => {
  const {
    id,
    year,
    // sections,
    // parties,
  } = schoolYear;

  return {
    id,
    year,
    // sections: sections && sections.map(sectionToFetchPayload),
    // parties: parties && parties.map(partyToFetchPayload),
  };
};
