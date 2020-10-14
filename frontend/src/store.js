import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import daysReducer from "./reducers/daysReducer";
import stationsReducer from "./reducers/obsStationReducer";
import userReducer from "./reducers/userReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer,
  days: daysReducer
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

export default store;
