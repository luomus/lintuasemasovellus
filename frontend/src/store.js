import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import daysReducer from "./reducers/daysReducer";
import stationsReducer from "./reducers/obsStationReducer";
import userObservatoryReducer from "./reducers/userObservatoryReducer";
import dailyActionsReducer from "./reducers/dailyActionsReducer";
import catchRowsReducer from "./reducers/catchRowsReducer";
import userReducer from "./reducers/userReducer";
import notificationsReducer from "./reducers/notificationsReducer";
import speciesReducer from "./reducers/speciesReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer,
  days: daysReducer,
  userObservatory: userObservatoryReducer,
  dailyActions: dailyActionsReducer,
  catchRows: catchRowsReducer,
  notifications: notificationsReducer,
  speciesData: speciesReducer
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);



export default store;
