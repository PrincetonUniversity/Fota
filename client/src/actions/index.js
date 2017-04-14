import axios from 'axios';

export const PHOTOS_AND_RESTS = '12308asdas';

export function getPhotosAndRests(sort, lat, lng) {
  const request = axios.get(`https://fotafood.herokuapp.com/api/photo?order=${sort}&lat=${lat}&lng=${lng}`);
  return {
    type: PHOTOS_AND_RESTS,
    payload: request
  };
}
