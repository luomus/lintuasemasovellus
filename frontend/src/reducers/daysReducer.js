import { getDays } from "../services";

export const refreshDays = () => {
  return async dispatch => {
    dispatch(setDays(null));
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

const daysReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_DAYS":
      return action.data.days;
    default:
      return state;
  }
};

export default daysReducer;
