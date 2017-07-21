/******************************************************************************
 * Called by: Base, Camera/CameraCommentsPage, Camera/CameraLoginPage,
 * Camera/CameraPage, Navbar
 * Dependencies: actions/
 *
 * Description: Global state for whether or not the camera should be displayed.
 *
 * Bugs/Todo: Not necessary any more. After finishing switching to react-navigation,
 * should probably delete
 *
 ******************************************************************************/

import { CAMERA_STATE } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case CAMERA_STATE:
      return action.payload;
    default:
      return state;
  }
}
