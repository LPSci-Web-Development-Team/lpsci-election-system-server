// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreateSchoolYearPayload } from '../../models/payloads/schoolYear';

// ANCHOR Entities
import { SchoolYear } from '../../models/entities/SchoolYear';

/**
 * ANCHOR: Get all school years
 */
export const getAllSchoolYears = async () => (
  getRepository(SchoolYear)
    .find({
      order: {
        year: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get a school year by id
 * @param id School year's id
 */
export const getSchoolYearById = async (
  id: string,
) => (
  getRepository(SchoolYear)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Create a school year
 *
 * @param payload Create school year payload
 */
export const createSchoolYear = async (
  payload: ICreateSchoolYearPayload,
) => {
  const { year } = payload;

  const schoolYearRepository = getRepository(SchoolYear);

  const newSchoolYear = schoolYearRepository
    .create({
      year,
    });

  const schoolYear = await schoolYearRepository
    .save(newSchoolYear);

  return schoolYear;
};

/**
 * ANCHOR: Update school year
 *
 * @param payload Update schoolYear payload
 * @param currentSchoolYear Current schoolYear
 */
export const updateSchoolYear = async (
  payload: ICreateSchoolYearPayload,
  currentSchoolYear: SchoolYear,
) => {
  const { year } = payload;

  const newSchoolYear = currentSchoolYear;
  newSchoolYear.year = year;

  const schoolYear = await getRepository(SchoolYear)
    .save(newSchoolYear);

  return schoolYear;
};
