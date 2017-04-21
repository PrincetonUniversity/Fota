import { combineReducers } from 'redux';
import PhotoReducer from './photos';
import RestaurantReducer from './restaurants';
import CameraReducer from './cameraState';

export default combineReducers({
    photos: PhotoReducer,
    restaurants: RestaurantReducer,
    cameraVisible: CameraReducer
});
