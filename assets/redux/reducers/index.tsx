import addReducer from "./addReducer";
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    add:addReducer,
})
export default rootReducer  