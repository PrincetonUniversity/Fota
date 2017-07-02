/******************************************************************************
 * Called by: OrderToggler
 *
 * Dependencies: actions/
 *
 * Description: Global state for the current sorting order (hot or new).
 *
 ******************************************************************************/

import { SORTING } from '../actions/index';

export default function (state = 'hot', action) {
  switch (action.type) {
    case SORTING:
      return action.payload;
    default:
      return state;
  }
}
