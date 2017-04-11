import axios from 'axios';

export const PHOTOS_AND_RESTS = '12308asdas';

export function getPhotosAndRests(sort) {
  let latitude = 0;
  let longitude = 0;
  navigator.geolocation.getCurrentPosition(
    position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    }
  );

  const requestString = `https://fotafood.herokuapp.com/api/photo?order=${sort}&lat=${latitude}&lng=${longitude}`;
  const request = axios.get(requestString);
  return {
    type: PHOTOS_AND_RESTS,
    payload: request
  };
}
