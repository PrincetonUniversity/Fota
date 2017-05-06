import request from '../helpers/axioshelper';

export const PHOTOS_AND_RESTS = '12308asdas';
export const CAMERA_STATE = 'a9x8c7vm1';
export const LOGIN = 'randomtext';
export const LOADING = '9(AA6969asD)';
export const SORTING = ')!sdj0ad!SDAD::L';
export const NAVIGATOR = 'fjiq3vfojvew';

export function getPhotosAndRests(sort, lat, lng) {
  const req = request.get(`https://fotafood.herokuapp.com/api/photo?order=${sort}&lat=${lat}&lng=${lng}&distance=${1}`)
    .catch(e => request.showErrorAlert(e));
  return {
    type: PHOTOS_AND_RESTS,
    payload: req
  };
}

export function setNavigator(navigator) {
  return {
    type: NAVIGATOR,
    payload: navigator
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
