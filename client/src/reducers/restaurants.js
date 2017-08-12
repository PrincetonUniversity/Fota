/******************************************************************************
 * Called by: Base, Camera/CameraCommentsPage, Camera/CameraLoginPage,
 * Camera/CameraPage
 * Dependencies: actions/
 *
 * Description: Global state containing a list of all nearby restaurants
 * associated with the photos displayed on the home page (PhotoList).
 *
 ******************************************************************************/


import { PHOTOS_AND_RESTS } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case PHOTOS_AND_RESTS:
      if (action.payload) {
        return action.payload.data;
      }
      return state;
    default:
      return state;
  }
}
