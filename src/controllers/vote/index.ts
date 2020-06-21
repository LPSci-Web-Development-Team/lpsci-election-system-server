// ANCHOR Typeorm
import { getRepository } from 'typeorm';

// ANCHOR Entities
import { Vote } from '../../models/entities/Vote';
import { Student } from '../../models/entities/Student';
import { Candidate } from '../../models/entities/Candidate';

/**
 * ANCHOR: Get all votes
 */
export const getAllVotes = async () => (
  getRepository(Vote)
    .find()
);

/**
 * ANCHOR: Get a vote by id
 * @param id Vote's id
 */
export const getVoteById = async (
  id: string,
) => (
  getRepository(Vote)
    .findOne({
      where: {
        id,
      },
    })
);

/**
 * ANCHOR: Create a vote
 *
 * @param payload Create vote payload
 * @param user Associated user
 */
export const createVote = async (
  candidate: Candidate,
  student: Student,
) => {
  const voteRepository = getRepository(Vote);

  const newVote = voteRepository
    .create({
      student,
      candidate,
    });

  const vote = await voteRepository
    .save(newVote);

  return vote;
};
