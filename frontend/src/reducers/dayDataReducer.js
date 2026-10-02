import { getDaysObservationPeriods, searchDayInfo } from "../services";

const FETCH_DAY_DATA_REQUEST = "FETCH_DAY_DATA_REQUEST";
const FETCH_DAY_DATA_SUCCESS = "FETCH_DAY_DATA_SUCCESS";
const FETCH_DAY_DATA_FAILURE = "FETCH_DAY_DATA_FAILURE";
const RESET_DAY_DATA = "RESET_DAY_DATA";
const UPDATE_OBSERVATION_PERIODS_REQUEST = "UPDATE_OBSERVATION_PERIODS_REQUEST";
const UPDATE_OBSERVATION_PERIODS = "UPDATE_OBSERVATION_PERIODS";

const initialState = {
  data: null,
  loading: false,
  error: null,
};
let currentController = new AbortController();
let observationPeriodsController = new AbortController();

export const refreshDayData = (day, observatory) => async (dispatch) => {
  observationPeriodsController.abort();
  currentController.abort();
  currentController = new AbortController();
  const controller = currentController;

  if (!day || !observatory) {
    dispatch({ type: FETCH_DAY_DATA_SUCCESS, data: null });
    return;
  }

  dispatch({
    type: FETCH_DAY_DATA_REQUEST,
  });

  try {
    const dayInfo = await searchDayInfo(day, observatory);
    if (controller.signal.aborted) {
      return;
    }

    const observationPeriods = await getDaysObservationPeriods(dayInfo.id);
    if (controller.signal.aborted) {
      return;
    }

    dispatch({
      type: FETCH_DAY_DATA_SUCCESS,
      data: {
        dayInfo,
        observationPeriods
      },
    });
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

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

export const refreshObservationPeriods = (dayId) => async (dispatch) => {
  observationPeriodsController.abort();
  observationPeriodsController = new AbortController();
  const controller = observationPeriodsController;

  dispatch({
    type: UPDATE_OBSERVATION_PERIODS_REQUEST,
  });

  try {
    const observationPeriods = await getDaysObservationPeriods(dayId);
    if (controller.signal.aborted) {
      return;
    }

    dispatch({
      type: UPDATE_OBSERVATION_PERIODS,
      dayId,
      observationPeriods,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    dispatch({
      type: FETCH_DAY_DATA_FAILURE,
      error: error.message,
    });
  }
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

    case UPDATE_OBSERVATION_PERIODS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case UPDATE_OBSERVATION_PERIODS:
      if (!state.data || state.data.dayInfo?.id !== action.dayId) {
        return state;
      }
      return {
        loading: false,
        error: null,
        data: {
          ...state.data,
          observationPeriods: action.observationPeriods,
        },
      };

    case RESET_DAY_DATA:
      currentController.abort();
      currentController = new AbortController();
      observationPeriodsController.abort();
      observationPeriodsController = new AbortController();

      return initialState;

    default:
      return state;
  }
};

export default dayDataReducer;
