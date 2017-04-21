import { combineReducers } from 'redux';
import PhotoReducer from './photos';
import RestaurantReducer from './restaurants';
import CameraReducer from './cameraState';
import LoginReducer from './login';

export default combineReducers({
    photos: PhotoReducer,
    restaurants: RestaurantReducer,
    cameraVisible: CameraReducer,
    loginState: LoginReducer
});
