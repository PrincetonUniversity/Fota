import { combineReducers } from 'redux';
import LoginReducer from './login';
import LoadingReducer from './loading';
import SortingReducer from './sorting';

export default combineReducers({
    loginState: LoginReducer,
    loading: LoadingReducer,
    sorting: SortingReducer,
});
