import { combineReducers } from 'redux';
import PhotoReducer from './photos';
import RestaurantReducer from './restaurants';
import CameraReducer from './cameraState';
import LoginReducer from './login';
import LoadingReducer from './loading';
import SortingReducer from './sorting';
import NavigatorReducer from './navigator';

export default combineReducers({
    photos: PhotoReducer,
    restaurants: RestaurantReducer,
    cameraVisible: CameraReducer,
    loginState: LoginReducer,
    loading: LoadingReducer,
    sorting: SortingReducer,
    mainNavigator: NavigatorReducer
});
