// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { studentStateUserRouter } from './users/index';
import {
  setCacheAllStudentStateByYear,
  getCacheAllStudentStateByYear,
  getCacheAllStudentState,
  setCacheAllStudentState,
  getCacheStudentState,
  setCacheStudentState,
} from '../../utils/middlewares/cache/studentState';


// ANCHOR Utils
import { setStateValidatedPayload } from '../../utils/middlewares/validation';
import { setStateStudentStateFromParams } from '../../utils/middlewares/params/studentState';

// ANCHOR Controllers
import {
  getAllStudentStates,
  getStudentStateById,
  getAllStudentStatesByYear,
  createStudentState,
  deleteStudentState,
} from '../../controllers/studentState';
// import {
//   getAllStudentByStudentStateAndYear,
//   associateUserToStudentState,
//   dissociateUserFromStudentState,
// } from '../../controllers/studentState/users';

// ANCHOR Schema
import { createUpdateStudentStateSchema } from '../../models/payloads/schema/studentState';

// ANCHOR Payloads
import { studentStateToFetchPayload } from '../../models/payloads/studentState';

// ANCHOR Middlewares
import { requireSignIn, requireAdmin } from '../../utils/middlewares/auth';


/* ANCHOR: Router export ---------------------------------------------------- */
export const studentStateRouter = new Router({ prefix: '/studentState-state' });

/* ANCHOR: Get all studentState states ---------------------------------------------------- */
studentStateRouter.get(
  '/',
  requireAdmin,
  getCacheAllStudentState,
  async (ctx) => {
    const { studentStates } = ctx.state.cache;

    if (studentStates) {
      ctx.status = status.OK;
      ctx.body = studentStates;
    } else {
      const result = await getAllStudentStates();
      const parsedStudentState = result
        .map(studentStateToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedStudentState;
        // Set cache
        setCacheAllStudentState(parsedStudentState);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);


/* ANCHOR: Get all studentState states ---------------------------------------------------- */
studentStateRouter.get(
  '/school-year/:schoolYear',
  requireAdmin,
  getCacheAllStudentStateByYear('schoolYear'),
  async (ctx) => {
    const { studentStatesYear } = ctx.state.cache;
    const { schoolYear } = ctx.params;

    if (studentStatesYear) {
      ctx.status = status.OK;
      ctx.body = studentStatesYear;
    } else {
      const result = await getAllStudentStatesByYear(schoolYear);
      const parsedStudentState = result
        .map(studentStateToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedStudentState;
        // Set cache
        setCacheAllStudentStateByYear(parsedStudentState, schoolYear);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Get studentState by id ---------------------------------------------------- */
studentStateRouter.get(
  '/:studentStateId',
  requireAdmin,
  getCacheStudentState('studentStateId'),
  async (ctx) => {
    const { studentState } = ctx.state.cache;

    if (studentState) {
      ctx.status = status.OK;
      ctx.body = studentState;
    } else {
      const { studentStateId } = ctx.params;

      const result = await getStudentStateById(studentStateId);

      if (result) {
        const parsedStudentState = studentStateToFetchPayload(result);

        ctx.status = status.OK;
        ctx.body = parsedStudentState;
        // Set cache
        setCacheStudentState(studentStateId, parsedStudentState);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);


/* ANCHOR: Create studentState ---------------------------------------------- */
studentStateRouter.post(
  '/:studentStateId',
  requireAdmin,
  setStateValidatedPayload(createUpdateStudentStateSchema),
  async (ctx) => {
    const { payload } = ctx.state;
    const newStudent = await createStudentState(payload);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllStudentStates();
    const parsedStudentState = result.map(studentStateToFetchPayload);

    setCacheAllStudentState(parsedStudentState);
  },
);

/* ANCHOR: Delete studentState ---------------------------------------------- */
studentStateRouter.delete(
  '/:studentStateId',
  requireSignIn,
  setStateStudentStateFromParams('studentStateId'),
  async (ctx) => {
    const { studentState } = ctx.state;
    const newStudent = await deleteStudentState(studentState);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllStudentStates();
    const parsedStudentState = result.map(studentStateToFetchPayload);

    setCacheAllStudentState(parsedStudentState);
  },
);

// ANCHOR Merge sub router for studentState router
studentStateRouter.use(
  '/:studentStateId',
  // Merge student state user routes and methods
  studentStateUserRouter.routes(),
  studentStateUserRouter.allowedMethods(),
);
