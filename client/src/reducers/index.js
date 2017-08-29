import { combineReducers } from 'redux';
import LoginReducer from './login';
import LoadingReducer from './loading';
import browseLocationReducer from './browseLocation';

export default combineReducers({
    loginState: LoginReducer,
    loading: LoadingReducer,
    browsingPrinceton: browseLocationReducer
});
