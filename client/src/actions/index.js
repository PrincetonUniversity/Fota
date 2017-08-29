/******************************************************************************
 * Called by: OrderToggler, Photo/PhotoList, reducers (redux)
 *
 * Dependencies: helpers/axioshelper
 *
 * Description: The actions to trigger reducers in redux. See reducers/ for
 * more info.
 *
 ******************************************************************************/

export const LOGIN = 'randomtext';
export const LOADING = '9(AA6969asD)';
export const LOCATION = ')!sdj0ad!SDAD::L';

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

export function browseFromPrinceton(browsing) {
  console.log(browsing);
  return {
    type: LOCATION,
    payload: browsing
  };
}

