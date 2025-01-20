import { combineReducers } from "redux";
import dailyActionsReducer, { setDailyActions, setDefaultActions } from "./dailyActionsReducer";
import catchRowsReducer, { setCatches } from "./catchRowsReducer";
import baseFormDataReducer, {
  setInitialBaseFormData,
  setDay,
  setObservers,
  setComment,
  setLocation,
  setShorthand,
  setType
} from "./baseFormDataReducer";
import { dayStringToDate, getCatches } from "../../services";
import { createSelector } from "reselect";

export const dateSelector = createSelector(
  [state => state.formData.baseData.day],
  (day) => (dayStringToDate(day))
);

export const setFormData = (initialFormData) => {
  return async dispatch => {
    dispatch(setInitialBaseFormData(initialFormData.baseData));
    dispatch(setDailyActions(initialFormData.dailyActions));
    dispatch(setCatches(initialFormData.catchRows));
  };
};

export const emptyShorthand = () => {
  return async dispatch => {
    dispatch(setType(""));
    dispatch(setLocation(""));
    dispatch(setShorthand(""));
  };
};

const formDataReducer = combineReducers({
  baseData: baseFormDataReducer,
  dailyActions: dailyActionsReducer,
  catchRows: catchRowsReducer
});

export default formDataReducer;
