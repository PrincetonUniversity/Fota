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
