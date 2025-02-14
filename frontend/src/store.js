import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import daysReducer from "./reducers/daysReducer";
import stationsReducer from "./reducers/obsStationReducer";
import userObservatoryReducer from "./reducers/userObservatoryReducer";
import userReducer from "./reducers/userReducer";
import speciesReducer from "./reducers/speciesReducer";
import notificationsReducer from "./reducers/notificationsReducer";
import savingStateReducer from "./reducers/savingStateReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer,
  days: daysReducer,
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
