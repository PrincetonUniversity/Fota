/******************************************************************************
 * Called by: Photo/PhotoList
 * Dependencies: actions/
 *
 * Description: Global state for whether the pictures are still loading on the
 * home page (Photo/PhotoList).
 *
 ******************************************************************************/


import { LOADING } from '../actions/index';

export default function (state = true, action) {
  switch (action.type) {
    case LOADING:
      return action.payload;
    default:
      return state;
  }
}
