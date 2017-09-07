/******************************************************************************
 * Called by: OrderToggler, Photo/PhotoList, reducers (redux)
 *
 * Dependencies: helpers/axioshelper
 *
 * Description: The actions to trigger reducers in redux. See reducers/ for
 * more info.
 *
 ******************************************************************************/
export const PHOTOS = '34u09oijfhgiu';
export const VOTE = 'DH(*#ODSfuewfh3';
export const LISTS = 'dsoijfaredux';
export const LOGIN = 'randomtext';
export const LOADING = '9(AA6969asD)';
export const LOCATION = ')!sdj0ad!SDAD::L';
export const PROFILE_RELOAD = 'efiwewk09';

export function makePhotoTable(list) {
  return {
    type: PHOTOS,
    payload: list
  };
}

export function voteOnPhotoTable(id, newCount, newLike, newDislike) {
  return {
    type: VOTE,
    payload: { id, newCount, newLike, newDislike }
  };
}

export function setScrollingList(listRef, name) {
  return {
    type: LISTS,
    payload: { listRef, name }
  };
}

export function setProfileReloader(func) {
  return {
    type: PROFILE_RELOAD,
    payload: func
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

export function browseFromPrinceton(browsing) {
  return {
    type: LOCATION,
    payload: browsing
  };
}
