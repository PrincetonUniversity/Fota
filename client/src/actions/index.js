/******************************************************************************
 * Called by: OrderToggler, Photo/PhotoList, reducers (redux)
 *
 * Dependencies: helpers/axioshelper
 *
 * Description: The actions to trigger reducers in redux. See reducers/ for
 * more info.
 *
 ******************************************************************************/

export const CAMERA_STATE = 'a9x8c7vm1';
export const LOGIN = 'randomtext';
export const LOADING = '9(AA6969asD)';
export const SORTING = ')!sdj0ad!SDAD::L';

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
export function setLoading(loading) {
  return {
    type: LOADING,
    payload: loading
  };
}

// Order must be either 'hot' or 'new'
export function changeSorting(order) {
  return {
    type: SORTING,
    payload: order
  };
}
