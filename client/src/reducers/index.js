import { combineReducers } from 'redux';
import CameraReducer from './cameraState';
import LoginReducer from './login';
import LoadingReducer from './loading';
import SortingReducer from './sorting';

export default combineReducers({
    cameraVisible: CameraReducer,
    loginState: LoginReducer,
    loading: LoadingReducer,
    sorting: SortingReducer,
});
