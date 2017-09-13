import { combineReducers } from 'redux';
import LoginReducer from './login';
import LoadingReducer from './loading';
import BrowseLocationReducer from './browseLocation';
import PhotoReducer from './photos';
import ProfileReloadReducer from './profileReloader';
import ListsReducer from './scrollingList';
import HomeNavReducer from './navigateToNew';
import BaseNavReducer from './navigateToHome';

export default combineReducers({
    loginState: LoginReducer,
    loading: LoadingReducer,
    browsingPrinceton: BrowseLocationReducer,
    photoTable: PhotoReducer,
    reloadProfile: ProfileReloadReducer,
    lists: ListsReducer,
    navigateToNew: HomeNavReducer,
    navigateToHome: BaseNavReducer
});
