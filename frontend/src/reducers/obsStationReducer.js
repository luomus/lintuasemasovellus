import { getObservationStations } from "../services";

const initialState = {
  data: null,
  error: null,
};

const hankoStandardCatches = [
  {
    "pyyntialue": "Vakioverkot",
    "pyyntitapa": "W / C",
    "lukumaara": 1,
    "verkonPituus": 9,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyyntialue": "Vakioverkko, K",
    "pyyntitapa": "W / C",
    "lukumaara": 1,
    "verkonPituus": 12,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyyntialue": "Piha",
    "pyyntitapa": "L",
    "lukumaara": 1,
    "verkonPituus": 9,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyyntialue": "Petoverkko",
    "pyyntitapa": "V / C",
    "lukumaara": 1,
    "verkonPituus": 12,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyyntialue": "Ruovikko",
    "pyyntitapa": "L",
    "lukumaara": 1,
    "verkonPituus": 9,
    "alku": "00:00",
    "loppu": "00:00"
  }
];
const hankoDefaultActions = { standardObs: false, gåu: false, standardRing: false, owlStandard: false, mammals: false, attachments: "0" };

export const initializeStations = () => {
  return async dispatch => {
    try {
      const stations = await getObservationStations();
      stations.forEach((station) => {
        if (station.observatory === "Hangon_Lintuasema") {
          station.standardCatches = hankoStandardCatches;
          station.defaultActions = hankoDefaultActions;
        } else {
          station.standardCatches = [];
          station.defaultActions = {};
        }
      });
      dispatch({
        type: "SET_STATIONS",
        data: {
          stations
        }
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: "SET_STATIONS_ERROR",
        error: e.message
      });
    }
  };
};

const stationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STATIONS":
      return { data: action.data.stations, error: null };
    case "SET_STATIONS_ERROR":
      return { data: null, error: action.error };
    default:
      return state;
  }
};

export default stationsReducer;
