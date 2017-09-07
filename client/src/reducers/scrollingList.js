/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { LISTS } from '../actions/index';

export default function (state = {}, action) {
  switch (action.type) {
    case LISTS: {
      const result = { ...state };
      result[action.payload.name] = action.payload.listRef;
      return result;
    }
    default:
      return state;
  }
}
