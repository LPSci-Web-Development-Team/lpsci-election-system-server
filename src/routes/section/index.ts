// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';

// ANCHOR Utils
import { setStateValidatedPayload } from '../../utils/middlewares/validation';
import { setStateSectionFromParams } from '../../utils/middlewares/params/section';

// ANCHOR Controllers
import {
  getAllSections, getSectionById, updateSection, deleteSection,
} from '../../controllers/section';

// ANCHOR Schema
import { createUpdateSectionSchema } from '../../models/payloads/schema/section';

// ANCHOR Payloads
import { sectionToFetchPayload } from '../../models/payloads/section';

// ANCHOR Middlewares
import { requireAdmin } from '../../utils/middlewares/auth';
import {
  setCacheAllSection, setCacheSection, getCacheAllSection, getCacheSection,
} from '../../utils/middlewares/cache/section';

// ANCHOR Routes
import { sectionSchoolYearRouter } from './schoolYear';

/* ANCHOR: Router export ---------------------------------------------------- */
export const sectionRouter = new Router({ prefix: '/section' });

/* ANCHOR: Get all sections ---------------------------------------------------- */
sectionRouter.get(
  '/',
  requireAdmin,
  getCacheAllSection,
  async (ctx) => {
    const { sections } = ctx.state.cache;

    if (sections) {
      ctx.status = status.OK;
      ctx.body = sections;
    } else {
      const result = await getAllSections();
      const parsedSection = result.map(sectionToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedSection;
        // Set cache
        setCacheAllSection(parsedSection);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get section by id ---------------------------------------------------- */
sectionRouter.get(
  '/:sectionId',
  getCacheSection('sectionId'),
  async (ctx) => {
    const { section } = ctx.state.cache;

    if (section) {
      ctx.status = status.OK;
      ctx.body = section;
    } else {
      const { sectionId } = ctx.params;

      const result = await getSectionById(sectionId);

      if (result) {
        const parsedSection = sectionToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedSection;
        // Set cache
        setCacheSection(sectionId, parsedSection);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Update section ---------------------------------------------- */
sectionRouter.put(
  '/:sectionId',
  requireAdmin,
  setStateSectionFromParams('sectionId'),
  setStateValidatedPayload(createUpdateSectionSchema),
  async (ctx) => {
    const { section, payload } = ctx.state;
    const newSection = await updateSection(payload, section);

    ctx.status = status.OK;
    ctx.body = newSection;

    // Revalidate cache
    const result = await getAllSections();
    const parsedSection = result.map(sectionToFetchPayload);

    setCacheAllSection(parsedSection);
  },
);

/* ANCHOR: Delete section ---------------------------------------------- */
sectionRouter.delete(
  '/:sectionId',
  requireAdmin,
  setStateSectionFromParams('sectionId'),
  async (ctx) => {
    const { section } = ctx.state;
    const newStudent = await deleteSection(section);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllSections();
    const parsedSection = result.map(sectionToFetchPayload);

    setCacheAllSection(parsedSection);
  },
);

// ANCHOR Merge sub router for section router
sectionRouter.use(
  '/:sectionId',
  // Merge display photo router
  sectionSchoolYearRouter.routes(),
  sectionSchoolYearRouter.allowedMethods(),
);
