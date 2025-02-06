import { combineReducers } from "redux";
import saveStateReducer, { resetSaveState } from "./saveStateReducer";
import notificationsReducer, { resetNotifications } from "./notificationsReducer";

export const clearFormState = () => {
  return async dispatch => {
    dispatch(resetSaveState());
    dispatch(resetNotifications());
  };
};

const formStateReducer = combineReducers({
  saveState: saveStateReducer,
  notifications: notificationsReducer
});

export default formStateReducer;
