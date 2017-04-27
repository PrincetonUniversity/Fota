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
