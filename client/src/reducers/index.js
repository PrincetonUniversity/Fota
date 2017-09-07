import { combineReducers } from 'redux';
import LoginReducer from './login';
import LoadingReducer from './loading';
import BrowseLocationReducer from './browseLocation';
import PhotoReducer from './photos';
import ProfileReloadReducer from './profileReloader';

export default combineReducers({
    loginState: LoginReducer,
    loading: LoadingReducer,
    browsingPrinceton: BrowseLocationReducer,
    photoTable: PhotoReducer,
    reloadProfile: ProfileReloadReducer,
});
