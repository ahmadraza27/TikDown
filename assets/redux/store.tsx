// store.tsx
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;






// import { createStore ,applyMiddleware} from "redux";
// import rootReducer from "./reducers";
// import thunk from "redux-thunk";

// const store = createStore(rootReducer, applyMiddleware(thunk));;
// export default store;