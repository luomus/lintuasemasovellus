import { getObservationLocations } from "../services";

export const getLocations = (stationId) => {
  return async dispatch => {
    const locations = await getObservationLocations(stationId);
    console.log(locations);
    dispatch(setLocations(stationId, locations));
  };
};

export const setLocations = (stationId, locations) => {
  return {
    type: "SET_LOCATIONS",
    data: {
      stationId: [
        ...locations
      ]
    }
  };
};

const locationsReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_LOCATIONS":
      return action.data.locations;
    default:
      return state;
  }
};

export default locationsReducer;
