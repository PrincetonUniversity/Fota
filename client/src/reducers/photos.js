/******************************************************************************
 * Called by: Base, Camera/CameraCommentsPage, Camera/CameraLoginPage,
 * Camera/CameraPage, Navbar
 * Dependencies: actions/
 *
 * Description: Global state containing a list of all nearby photos to be
 * displayed on the home page (Photo/PhotoList).
 *
 ******************************************************************************/

import { PHOTOS_AND_RESTS } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case PHOTOS_AND_RESTS:
      if (action.payload) {
        return action.payload.data.photos;
      }
      return state;
    default:
      return state;
  }
}
