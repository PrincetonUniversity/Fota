/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { LAST_UPLOADED } from '../actions/index';

export default function (state = {}, action) {
  switch (action.type) {
    case LAST_UPLOADED:
      return action.payload;
    default:
      return state;
  }
}
