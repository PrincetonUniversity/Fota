/******************************************************************************
 * Called by: Photo/PhotoList
 * Dependencies: actions/
 *
 * Description: Global state for whether the pictures are still loading on the
 * home page (Photo/PhotoList).
 *
 ******************************************************************************/


import { LOADING, PHOTOS_AND_RESTS } from '../actions/index';

export default function (state = true, action) {
  switch (action.type) {
    case LOADING:
      return true;
    case PHOTOS_AND_RESTS:
      return false;
    default:
      return state;
  }
}
