// rootReducer.tsx
import { combineReducers } from "redux";
import addReducer from "./addReducer";

const rootReducer = combineReducers({
  add: addReducer,
});

export default rootReducer;





// import addReducer from "./addReducer";
// import { combineReducers } from 'redux';

// const rootReducer = combineReducers({
//     add:addReducer,
// })
// export default rootReducer  