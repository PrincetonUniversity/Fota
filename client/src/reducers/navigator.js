/******************************************************************************
 * Called by: Navbar
 * Dependencies: actions/
 *
 * Description: Global state for what the main navigator is (Navbar).
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
