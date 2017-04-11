import axios from 'axios';

export const PHOTOS_AND_RESTS = '12308asdas';

export function getPhotosAndRests(sort) {
  const request = axios.get(`https://fotafood.herokuapp.com/api/photo?order=${sort}&lat=55.1234&lng=-123.551`);
  return {
    type: PHOTOS_AND_RESTS,
    payload: request
  };
}
