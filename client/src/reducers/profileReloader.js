/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { PROFILE_RELOAD } from '../actions/index';

export default function (state = null, action) {
  switch (action.type) {
    case PROFILE_RELOAD:
      return action.payload;
    default:
      return state;
  }
}
