/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { VOTE_BUBBLE } from '../actions/index';

export default function (state = null, action) {
  switch (action.type) {
    case VOTE_BUBBLE:
      return action.payload;
    default:
      return state;
  }
}
