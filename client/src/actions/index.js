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
export const NAV_TO_NEW = '98z8xh3,x98ekjn';
export const NAV_TO_HOME = '9z8ijx,qmnsdjhfoiux';
export const PERMISSION = 'hialbertitsbenny';

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

export function saveNavNew(func) {
  return {
    type: NAV_TO_NEW,
    payload: func
  };
}

export function saveBaseNavHome(func) {
  return {
    type: NAV_TO_HOME,
    payload: func
  };
}

export function setPermission(permission) {
  return {
    type: PERMISSION,
    payload: permission
  };
}
