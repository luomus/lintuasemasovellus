import { combineReducers, createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import daysReducer from "./reducers/daysReducer";
import stationsReducer from "./reducers/obsStationReducer";
import userObservatoryReducer from "./reducers/userObservatoryReducer";
import userReducer from "./reducers/userReducer";
import speciesReducer from "./reducers/speciesReducer";
import formDataReducer from "./reducers/formDataReducer/formDataReducer";
import formStateReducer from "./reducers/formStateReducer/formStateReducer";


const reducer = combineReducers({
  user: userReducer,
  stations: stationsReducer,
  days: daysReducer,
  userObservatory: userObservatoryReducer,
  speciesData: speciesReducer,
  formData: formDataReducer,
  formState: formStateReducer
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);



export default store;
