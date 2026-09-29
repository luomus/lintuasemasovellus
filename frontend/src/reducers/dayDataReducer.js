import { getDaysObservationPeriods, searchDayInfo } from "../services";

const FETCH_DAY_DATA_REQUEST = "FETCH_DAY_DATA_REQUEST";
const FETCH_DAY_DATA_SUCCESS = "FETCH_DAY_DATA_SUCCESS";
const FETCH_DAY_DATA_FAILURE = "FETCH_DAY_DATA_FAILURE";
const RESET_DAY_DATA = "RESET_DAY_DATA";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDayData = (day, observatory) => async (dispatch) => {
  if (!day || !observatory) {
    dispatch({ type: FETCH_DAY_DATA_SUCCESS, data: null });
    return;
  }

  dispatch({
    type: FETCH_DAY_DATA_REQUEST,
  });

  try {
    const dayInfo = await searchDayInfo(day, observatory);

    const observationPeriods = await getDaysObservationPeriods(dayInfo.id);

    dispatch({
      type: FETCH_DAY_DATA_SUCCESS,
      data: {
        dayInfo,
        observationPeriods
      },
    });
  } catch (error) {
    dispatch({
      type: FETCH_DAY_DATA_FAILURE,
      error: error.message,
    });
  }
};

export const resetDayData = () => {
  return {
    type: RESET_DAY_DATA
  };
};

const dayDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DAY_DATA_REQUEST:
      return {
        data: null,
        loading: true,
        error: null,
      };

    case FETCH_DAY_DATA_SUCCESS:
      return {
        data: action.data,
        loading: false,
        error: null,
      };

    case FETCH_DAY_DATA_FAILURE:
      return {
        data: null,
        loading: false,
        error: action.error,
      };
    case RESET_DAY_DATA:
      return initialState;

    default:
      return state;
  }
}

export default dayDataReducer;
