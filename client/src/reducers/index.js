import { combineReducers } from 'redux';
import PhotoReducer from './photos';
import RestaurantReducer from './restaurants';

export default combineReducers({
    photos: PhotoReducer,
    restaurants: RestaurantReducer
});
