import { combineReducers } from 'redux'
import dailyActionsReducer, {setDailyActions, setDefaultActions} from "./dailyActionsReducer";
import catchRowsReducer, {setCatches} from "./catchRowsReducer";
import baseFormDataReducer, {
  setInitialBaseFormData,
  setDay,
  setObservers,
  setComment,
  setLocation,
  setShorthand,
  setType
} from "./baseFormDataReducer";
import {dayStringToDate, getCatches} from "../../services";
import {createSelector} from "reselect";

export const dateSelector = createSelector(
  [state => state.formData.baseData.day],
  (day) => (dayStringToDate(day))
);

export const setInitialFormData = (day, observatory, dayData = {}) => {
  return async dispatch => {
    dispatch(setInitialBaseFormData(day, dayData["observers"], dayData["comment"]));
    await setDailyActionsAndCatches(dispatch, observatory, dayData);
  };
};

export const updateFormDataWithDayData = (day, observatory, dayData = {}) => {
  return async dispatch => {
    dispatch(setDay(day));
    dispatch(setObservers(dayData["observers"] || ""));
    dispatch(setComment(dayData["comment"] || ""));
    await setDailyActionsAndCatches(dispatch, observatory, dayData);
  };
};

export const emptyShorthand = () => {
  return async dispatch => {
    dispatch(setType(""));
    dispatch(setLocation(""));
    dispatch(setShorthand(""));
  };
};

const setDailyActionsAndCatches = async (dispatch, observatory, dayData) => {
  if (dayData["selectedactions"]) {
    dispatch(setDailyActions(JSON.parse(dayData["selectedactions"])));
  } else {
    dispatch(setDefaultActions(observatory));
  }

  const dayId = dayData["id"];
  if (dayId !== undefined && dayId !== null) {
    const catches = await getCatches(dayId);
    dispatch(setCatches(catches));
  } else {
    dispatch(setCatches([]));
  }
};

const formDataReducer = combineReducers({
  baseData: baseFormDataReducer,
  dailyActions: dailyActionsReducer,
  catchRows: catchRowsReducer
});

export default formDataReducer;
