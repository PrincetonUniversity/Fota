/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { LOGIN } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    default:
      return state;
  }
}
