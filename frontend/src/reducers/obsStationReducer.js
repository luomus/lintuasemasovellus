import { getObservationStations } from "../services";

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
  }
];
const hankoDefaultActions = { standardObs: false, gåu: false, standardRing: false, owlStandard: false, mammals: false, attachments: "0" };

export const initializeStations = () => {
  return async dispatch => {
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
