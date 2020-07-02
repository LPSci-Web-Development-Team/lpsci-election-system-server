// ANCHOR Status Codes
import * as status from 'http-status-codes';

// ANCHOR Koa
import Router from 'koa-router';
import { NotFoundError } from '../../../errors/custom/NotFound';

// ANCHOR Utils
import { setStateStudentStateFromParams } from '../../../utils/middlewares/params/studentState';

// ANCHOR Controllers
import {
  getAllStudentForStudentState,
  associateUserToStudentState,
  dissociateUserFromStudentState,
} from '../../../controllers/studentState/users';
import { getUserById } from '../../../controllers/user/index';

// ANCHOR Payloads
import { userToFetchPayload } from '../../../models/payloads/user';

// ANCHOR Middlewares
import { requireAdmin } from '../../../utils/middlewares/auth';
import {
  // getCacheAllStudentStateUsers,
  setCacheAllStudentStateUsers,
} from '../../../utils/middlewares/cache/studentState';

/* ANCHOR: Router export ---------------------------------------------------- */
export const studentStateUserRouter = new Router({ prefix: '/user' });

/* ANCHOR: Get all student for student states ---------------------------------------------- */
studentStateUserRouter.get(
  '/',
  requireAdmin,
  // getCacheAllStudentStateUsers('studentStateId'),
  setStateStudentStateFromParams('studentStateId'),
  async (ctx) => {
    const { studentStateUsers } = ctx.state.cache;
    const { studentState } = ctx.state;
    const { studentStateId } = ctx.params;

    if (studentStateUsers) {
      ctx.status = status.OK;
      ctx.body = studentStateUsers;
    } else {
      const result = await getAllStudentForStudentState(studentState);
      const parsedStudentState = result
        .map(userToFetchPayload);

      if (result) {
        ctx.status = status.OK;
        ctx.body = parsedStudentState;
        // Set cache
        setCacheAllStudentStateUsers(parsedStudentState, studentStateId);
      } else {
        ctx.status = status.NOT_FOUND;
      }
    }
  },
);

/* ANCHOR: Associate user to studentState ---------------------------------------------- */
studentStateUserRouter.put(
  '/associate/:userId',
  requireAdmin,
  setStateStudentStateFromParams('studentStateId'),
  async (ctx) => {
    const { studentState } = ctx.state;
    const { userId, studentStateId } = ctx.params;

    const user = await getUserById(userId);

    if (!user) {
      throw new NotFoundError(`User with id of ${userId} could not be found`);
    }

    const newStudent = await associateUserToStudentState(user, studentState);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllStudentForStudentState(studentState);
    const parsedStudentState = result
      .map(userToFetchPayload);

    setCacheAllStudentStateUsers(parsedStudentState, studentStateId);
  },
);

/* ANCHOR: Dissociate user from studentState ---------------------------------------------- */
studentStateUserRouter.put(
  '/dissociate/:userId',
  requireAdmin,
  setStateStudentStateFromParams('studentStateId'),
  async (ctx) => {
    const { studentState } = ctx.state;
    const { userId, studentStateId } = ctx.params;

    const user = await getUserById(userId);

    if (!user) {
      throw new NotFoundError(`User with id of ${userId} could not be found`);
    }

    const newStudent = await dissociateUserFromStudentState(user, studentState);

    ctx.status = status.OK;
    ctx.body = newStudent;

    // Revalidate cache
    const result = await getAllStudentForStudentState(studentState);
    const parsedStudentState = result
      .map(userToFetchPayload);

    setCacheAllStudentStateUsers(parsedStudentState, studentStateId);
  },
);
