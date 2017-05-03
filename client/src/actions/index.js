import axios from 'axios';

export const PHOTOS_AND_RESTS = '12308asdas';
export const CAMERA_STATE = 'a9x8c7vm1';
export const LOGIN = 'randomtext';
export const LOADING = '9(AA6969asD)';
export const SORTING = ')!sdj0ad!SDAD::L';

export function getPhotosAndRests(sort, lat, lng) {
  const request = axios.get(`https://fotafood.herokuapp.com/api/photo?order=${sort}&lat=${lat}&lng=${lng}&distance=${1}`);
  return {
    type: PHOTOS_AND_RESTS,
    payload: request
  };
}

export function setCameraState(visible) {
  return {
    type: CAMERA_STATE,
    payload: visible
  };
}

export function logInOrOut(user) {
  return {
    type: LOGIN,
    payload: user
  };
}

// The photo list is currently loading
export function loadingTrue() {
  return {
    type: LOADING,
    payload: true
  };
}

// Order must be either 'hot' or 'new'
export function changeSorting(order) {
  return {
    type: SORTING,
    payload: order
  };
}
