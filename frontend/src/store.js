import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "./reducers/userReducer";


const reducer = combineReducers({
  user: userReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

export default store;
