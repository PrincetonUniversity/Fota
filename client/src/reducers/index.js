import { combineReducers } from 'redux';
import CameraReducer from './cameraState';
import LoginReducer from './login';
import LoadingReducer from './loading';
import SortingReducer from './sorting';
import NavigationReducer from './navigator';

export default combineReducers({
    cameraVisible: CameraReducer,
    loginState: LoginReducer,
    loading: LoadingReducer,
    sorting: SortingReducer,
    mainNavigator: NavigationReducer
});
