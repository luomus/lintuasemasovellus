import { getObservationStations } from "../services";

const defaultActions = { standardObs: false, gåu: false, standardRing: false, owlStandard: false, mammals: false, attachments: "0" };

export const initializeStations = () => {
  return async dispatch => {
    const stations = await getObservationStations();
    stations.forEach((station) => {
      if (station.observatory === "Hangon_Lintuasema") {
        station.defaultActions = defaultActions;
      } else {
        station.defaultActions = {};
      }
    });
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
