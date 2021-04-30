import { parse, resetAll } from "./shorthand";
import globals from "../globalConstants";

let day = {
  day: "",
  comment: "",
  observers: "",
  observatory_id: "",
  selectedactions: ""
};

let observationPeriods = [];

let observationPeriod = {
  location: "",
  startTime: "",
  endTime: "",
  shorthandBlock: "",
  observationType: "",
};

let observation = {
  species: "",
  adultUnknownCount: 0,
  adultFemaleCount: 0,
  adultMaleCount: 0,
  juvenileUnknownCount: 0,
  juvenileFemaleCount: 0,
  juvenileMaleCount: 0,
  subadultUnknownCount: 0,
  subadultFemaleCount: 0,
  subadultMaleCount: 0,
  unknownUnknownCount: 0,
  unknownFemaleCount: 0,
  unknownMaleCount: 0,
  direction: "",
  bypassSide: "",
  notes: "",
  observationperiod_id: ""
};

const isTime = (row) => {
  return String(row).match(globals.timeRegex);
};

const parseTime = (timeString) => {
  let ret = "";
  for (let i = 0; i < timeString.length; i++) {
    if (timeString[Number(i)] === ".") {
      ret += ":";
    } else {
      ret += timeString[Number(i)];
    }
  }
  return ret;
};

const readyObservation = (observation, userID) => {
  observation["species"] = Object.values(globals.birdMap.get(observation["species"].toUpperCase()))[0];
  observation["direction"] = globals.directions.get(observation["direction"].toUpperCase());
  observation["bypassSide"] = globals.bypass.get(observation["bypassSide"]);
  observation["account_id"] = userID;
  return observation;
};


//remember to add dayID to periods in backend
export const loopThroughObservationPeriods = (shorthandRows, obsType, loc) => {
  let pausePeriod = false;
  observationPeriods = [];
  for (const row of shorthandRows) {
    if (!row) continue;
    if (isTime(row) && observationPeriod["shorthandBlock"] === "") {
      observationPeriod["startTime"] = parseTime(row);
      pausePeriod = false;
    } else if (isTime(row)) {
      observationPeriod["endTime"] = parseTime(row);
      observationPeriod["observationType"] = obsType;
      observationPeriod["location"] = loc;
      observationPeriods.push({ ...observationPeriod });
      observationPeriod["shorthandBlock"] = "";
      observationPeriod["startTime"] = parseTime(row);
      pausePeriod = false;
    } else if (!pausePeriod){
      if (row.trim() === "tauko"){
        observationPeriod["shorthandBlock"] = row;
        pausePeriod = true;
      }
      else if (observationPeriod["shorthandBlock"] === "") {
        observationPeriod["shorthandBlock"] = row;
      } else {
        observationPeriod["shorthandBlock"] = observationPeriod["shorthandBlock"] + "\n" + row;
      }
    }
  }
  return observationPeriods;
};

const toNum = (field) => {
  observation[String(field)]
    = observation[String(field)]
      ? Number(observation[String(field)])
      : 0;
};

const obsCountersToNum = () => {
  toNum("adultUnknownCount");
  toNum("adultFemaleCount");
  toNum("adultMaleCount");
  toNum("juvenileUnknownCount");
  toNum("juvenileFemaleCount");
  toNum("juvenileMaleCount");
  toNum("subadultUnknownCount");
  toNum("subadultFemaleCount");
  toNum("subadultMaleCount");
  toNum("unknownUnknownCount");
  toNum("unknownFemaleCount");
  toNum("unknownMaleCount");
};

export const setDayId = (id) => {
  day["id"] = id;
};

export const loopThroughObservations = (shorthandRows, userID) => {
  let oneBeforeWasTime = false;
  let isPausePeriod = false;
  let i = -1;
  const observations = [];// [ { periodOrderNum: i, shorthandRow: row, subObservations: []  }]
  let observationsOfPeriod = []; //Acts as a helper cache, since some pause period observations will otherwise be saved (which would be bad).
  for (const row of shorthandRows) {
    if (!row) continue;
    if (isTime(row)) {
      oneBeforeWasTime = true;
      observations.push(...observationsOfPeriod);
      observationsOfPeriod = [];
      isPausePeriod = false;
    } else if(!isPausePeriod){
      if (oneBeforeWasTime) {
        i++;
      }
      if(row.trim() === "tauko"){
        observationsOfPeriod = [];
        isPausePeriod = true;
      } else {
        oneBeforeWasTime = false;
        const parsed = parse(row);
        let observationObject = { subObservations: [] }; //create object of one observation (= shorthand row)
        observationObject["periodOrderNum"] = String(i);
        for (const sub of parsed.osahavainnot) {
          observation = sub;
          observation.species = parsed.species;
          obsCountersToNum();
          const obsToAdd = readyObservation(observation, userID);
          observationObject.subObservations.push(obsToAdd);
        }
        observationsOfPeriod.push(observationObject);
        resetAll();
      }
    }
  }
  return observations;
};
