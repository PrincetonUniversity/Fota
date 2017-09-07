/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { LOCATION } from '../actions/index';

export default function (state = false, action) {
  switch (action.type) {
    case LOCATION:
      return action.payload;
    default:
      return state;
  }
}
