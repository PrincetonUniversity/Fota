/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { PHOTOS, VOTE } from '../actions/index';

export default function (state = {}, action) {
  switch (action.type) {
    case PHOTOS: {
      const photoTable = {};
      action.payload.map(photo => { photoTable[photo.id] = photo; return 0; });
      return photoTable;
    }
    case VOTE: {
      if (state.length === 0) return state;
      const { id, newCount, newLike, newDislike } = action.payload;
      const oldRecord = state[id];
      const newRecord = {
        ...oldRecord,
        vote_count: newCount,
        user_upvote: newLike,
        user_downvote: newDislike
      };
      const result = { ...state };
      result[id] = newRecord;
      return result;
    }
    default:
      return state;
  }
}
