import { getObservationStations } from "../services";

export const initializeStations = () => {
  return async dispatch => {
    const stations = await getObservationStations();
    dispatch(setStations(stations));
  };
};

export const setStations = (stations) => {
  return {
    type: "SET_STATIONS",
    data: {
      stations
    }
  };
};

const stationsReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_STATIONS":
      return action.data.stations;
    default:
      return state;
  }
};

export default stationsReducer;
