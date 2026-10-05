import { getDays } from "../services";

const initialState = {
  data: null,
  error: null,
};
let currentController = new AbortController();

export const refreshDays = () => {
  return async dispatch => {
    currentController.abort();
    currentController = new AbortController();
    const controller = currentController;

    dispatch(setDays(null));
    try {
      const days = await getDays();

      if (controller.signal.aborted) {
        return;
      }

      dispatch(setDays(days));
    } catch (e) {
      if (controller.signal.aborted) {
        return;
      }

      console.error(e);
      dispatch({
        type: "SET_DAYS_ERROR",
        error: e.message
      });
    }
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

const daysReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DAYS":
      return { data: action.data.days, error: null };
    case "SET_DAYS_ERROR":
      return { data: null, error: action.error };
    default:
      return state;
  }
};

export default daysReducer;
