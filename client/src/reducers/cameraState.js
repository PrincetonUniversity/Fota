import { CAMERA_STATE } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case CAMERA_STATE:
      return action.payload;
    default:
      return state;
  }
}
