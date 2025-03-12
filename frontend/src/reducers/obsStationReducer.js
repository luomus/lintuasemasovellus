import { getObservationStations } from "../services";

const hankoStandardCatches = [
  {
    "pyydys": "Vakioverkko",
    "pyyntialue": "Vakioverkot K",
    "verkkokoodit": "",
    "lukumaara": 1,
    "verkonPituus": 12,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyydys": "Vakioverkko",
    "pyyntialue": "Vakioverkot muu",
    "verkkokoodit": "",
    "lukumaara": "4",
    "verkonPituus": 9,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyydys": "Petoverkot",
    "pyyntialue": "Vakiopetoverkot",
    "verkkokoodit": "",
    "lukumaara": "7",
    "verkonPituus": 12,
    "alku": "00:00",
    "loppu": "00:00"
  },
  {
    "pyydys": "Lisäverkko",
    "pyyntialue": "Piha",
    "verkkokoodit": "",
    "lukumaara": "7",
    "verkonPituus": 9,
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
