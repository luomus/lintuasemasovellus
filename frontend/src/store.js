import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import daysReducer from "./reducers/daysReducer";
import stationsReducer from "./reducers/obsStationReducer";
import userObservatoryReducer from "./reducers/userObservatoryReducer";
import userReducer from "./reducers/userReducer";
import speciesReducer from "./reducers/speciesReducer";
import notificationsReducer from "./reducers/notificationsReducer";
import savingStateReducer from "./reducers/savingStateReducer";
import dayDataReducer from "./reducers/dayDataReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer,
  days: daysReducer,
  dayData: dayDataReducer,
  userObservatory: userObservatoryReducer,
  speciesData: speciesReducer,
  notifications: notificationsReducer,
  savingState: savingStateReducer
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);



export default store;
