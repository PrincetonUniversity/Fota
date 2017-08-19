//import { AsyncStorage } from 'react-native';

const URL = 'https://fotabackend-173714.appspot.com/api';
const PHOTO_REQ = `${URL}/photos`;
const REST_REQ = `${URL}/restaurants`;
const USER_REQ = `${URL}/user`;
const CLIENT_API_KEY = 'AIzaSyCGhec-cpivaFlYfFQJ9T-kIZ8BlDs66P8'; //'AIzaSyBZSHaR5yI2dgyWXQ0CjCHOrHZ5NQvsUHc';

export function photoRequest(sort, lat, lng, radius) {
  return `${PHOTO_REQ}?key=${CLIENT_API_KEY}&order=${sort}&latitude=${lat}&longitude=${lng}&radius=${radius}`;
}

export function photoVote(id, type) {
  return `${PHOTO_REQ}/${id}?key=${CLIENT_API_KEY}&type=${type}`;
}

export function restRequest(id) {
  return `${REST_REQ}/${id}?key=${CLIENT_API_KEY}`;
}

export function profileRequest(user) {
  return `${USER_REQ}/${user}?key=${CLIENT_API_KEY}`;
}

export function restCommentRequest(id) {
  return `${REST_REQ}/${id}/comments/?key=${CLIENT_API_KEY}`;
}
