/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { NAV_TO_NEW } from '../actions/index';

export default function (state = null, action) {
  switch (action.type) {
    case NAV_TO_NEW:
      return action.payload;
    default:
      return state;
  }
}
