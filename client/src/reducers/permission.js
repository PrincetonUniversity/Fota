/******************************************************************************
 * Called by: Base
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the user is logged in.
 *
 ******************************************************************************/

import { PERMISSION } from '../actions/index';

export default function (state = {}, action) {
  switch (action.type) {
    case PERMISSION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
