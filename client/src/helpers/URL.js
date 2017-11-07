const URL = 'https://fotabackend-173714.appspot.com/api';
const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const GOOGLE_MAPS_URL = 'https://www.google.com/maps/dir';
const PHOTO_REQ = `${URL}/photos`;
const REST_REQ = `${URL}/restaurants`;
const COMMENT_REQ = `${URL}/comments`;
const USER_REQ = `${URL}/users`;
const SEARCH_REQ = `${URL}/search`;
const BOOKMARK_REQ = `${USER_REQ}/bookmarks`;
const CLIENT_API_KEY = 'AIzaSyBZSHaR5yI2dgyWXQ0CjCHOrHZ5NQvsUHc'; //'AIzaSyCGhec-cpivaFlYfFQJ9T-kIZ8BlDs66P8';

export function photoRequest(sort, lat, lng, radius) {
  return `${PHOTO_REQ}?key=${CLIENT_API_KEY}&order=${sort}&latitude=${lat}&longitude=${lng}&radius=${radius}`;
}

export function photoVote(id, type) {
  return `${PHOTO_REQ}/${id}?key=${CLIENT_API_KEY}&type=${type}`;
}

export function photoDelete(id) {
  return `${PHOTO_REQ}/${id}?key=${CLIENT_API_KEY}`;
}

export function reportAsSpam(id) {
  return `${PHOTO_REQ}/${id}/report?key=${CLIENT_API_KEY}`;
}

export function searchRequest(lat, lng, term) {
  return `${SEARCH_REQ}?key=${CLIENT_API_KEY}&latitude=${lat}&longitude=${lng}&term=${term}`;
}

export function filterRequest(filter, lat, lng, radius) {
  return `${PHOTO_REQ}/${filter}?key=${CLIENT_API_KEY}&order=hot&latitude=${lat}&longitude=${lng}&radius=${radius}`;
}

export function coordinateRequest(id) {
  return `${REST_REQ}/${id}/coordinates?key=${CLIENT_API_KEY}`;
}

export function restRequest(id) {
  return `${REST_REQ}/${id}?key=${CLIENT_API_KEY}`;
}

export function restCommentRequest(id) {
  return `${REST_REQ}/${id}/comments/?key=${CLIENT_API_KEY}`;
}

export function directionsRequest(curLat, curLng, destLat, destLng, mode) {
  return `${GOOGLE_MAPS_API_URL}?origin=${curLat},${curLng}&destination=${destLat},${destLng}&mode=${mode}&key=${CLIENT_API_KEY}`;
}

export function directionsURL(dest, mode) {
  return `${GOOGLE_MAPS_URL}/?api=1&destination=${dest}&travelmode=${mode}/`;
}

export function restBookmarkRequest(id) {
  return `${BOOKMARK_REQ}/${id}?key=${CLIENT_API_KEY}`;
}

export function restRecommendRequest(id, type) {
  return `${REST_REQ}/${id}/recommend?key=${CLIENT_API_KEY}&type=${type}`;
}

export function commentEdit(id) {
  return `${COMMENT_REQ}/${id}?key=${CLIENT_API_KEY}`;
}

export function commentVote(id, type) {
  return `${COMMENT_REQ}/${id}/vote?key=${CLIENT_API_KEY}&type=${type}`;
}

export function profileRequest() {
  return `${USER_REQ}/?key=${CLIENT_API_KEY}`;
}

export function rewardRequest() {
  return `${USER_REQ}/rewards?key=${CLIENT_API_KEY}`;
}

export function redeemRequest() {
  return `${USER_REQ}/redeem?key=${CLIENT_API_KEY}`;
}

export function changeNameRequest(displayName, uid) {
  return `${USER_REQ}/?displayName=${displayName}&uid=${uid}&key=${CLIENT_API_KEY}`;
}

export function nearbyRestRequest(lat, lng) {
  return `${REST_REQ}?key=${CLIENT_API_KEY}&latitude=${lat}&longitude=${lng}`;
}

export function checkPhotoRequest() {
  return `${PHOTO_REQ}/precheck?key=${CLIENT_API_KEY}`;
}

export function uploadPhotoRequest() {
  return `${PHOTO_REQ}?key=${CLIENT_API_KEY}`;
}
