import { combineReducers } from 'redux';
import LoginReducer from './login';
import LoadingReducer from './loading';

export default combineReducers({
    loginState: LoginReducer,
    loading: LoadingReducer,
});
