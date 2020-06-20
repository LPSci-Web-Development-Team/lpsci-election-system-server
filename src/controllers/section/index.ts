// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Payloads
import { ICreateSectionPayload } from '../../models/payloads/section';

// ANCHOR Entities
import { Section } from '../../models/entities/Section';
import { SchoolYear } from '../../models/entities/SchoolYear';

/**
 * ANCHOR: Get all sections
 */
export const getAllSections = async () => (
  getRepository(Section)
    .find({
      order: {
        gradeLevel: 'ASC',
      },
    })
);

/**
 * ANCHOR: Get a section by id
 * @param id Section's id
 */
export const getSectionById = async (
  id: string,
) => (
  getRepository(Section)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Create a section
 *
 * @param payload Create section payload
 */
export const createSection = async (
  payload: ICreateSectionPayload,
  schoolYear: SchoolYear,
) => {
  const { name, gradeLevel, adviser } = payload;

  const sectionRepository = getRepository(Section);

  const newSection = sectionRepository
    .create({
      name,
      gradeLevel,
      adviser,
      schoolYear,
    });

  const section = await sectionRepository
    .save(newSection);

  return section;
};

/**
 * ANCHOR: Update section
 *
 * @param payload Update section payload
 * @param currentSection Current section
 */
export const updateSection = async (
  payload: ICreateSectionPayload,
  currentSection: Section,
) => {
  const { name, gradeLevel, adviser } = payload;

  const newSection = currentSection;
  newSection.name = name;
  newSection.gradeLevel = gradeLevel;
  newSection.adviser = adviser;

  const section = await getRepository(Section)
    .save(newSection);

  return section;
};

/**
 * ANCHOR: Delete section
 *
 * @param currentSection Current section
 */
export const deleteSection = async (
  currentSection: Section,
) => {
  await getRepository(Section)
    .remove(currentSection);
};
