import { getDays } from "../services";

export const retrieveDays = () => {
  return async dispatch => {
    const days = await getDays();
    dispatch(setDays(days));
  };
};

export const setDays = (days) => {
  return {
    type: "SET_DAYS",
    data: {
      days
    }
  };
};

const daysReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_DAYS":
      return action.data.days;
    default:
      return state;
  }
};

export default daysReducer;
