import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import daysReducer from "./reducers/daysReducer";
import stationsReducer from "./reducers/obsStationReducer";
import userObservatoryReducer from "./reducers/userObservatoryReducer";
import dailyActionsReducer from "./reducers/dailyActionsReducer";

import userReducer from "./reducers/userReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer,
  days: daysReducer,
  userObservatory: userObservatoryReducer,
  dailyActions: dailyActionsReducer,
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);



export default store;
