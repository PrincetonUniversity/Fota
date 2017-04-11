import { PHOTOS_AND_RESTS } from '../actions/index';

export default function (state = [], action) {
  switch (action.type) {
    case PHOTOS_AND_RESTS:
      return action.payload.data.photos;
    default:
      return state;
  }
}
