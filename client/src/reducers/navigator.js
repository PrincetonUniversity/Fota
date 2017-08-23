/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { NAVIGATOR } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case NAVIGATOR:
      return action.payload;
    default:
      return state;
  }
}
