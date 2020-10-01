import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import stationsReducer from "./reducers/obsStationReducer";
import userReducer from "./reducers/userReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

export default store;
