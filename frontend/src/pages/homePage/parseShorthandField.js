import { postDay } from "../../services/dayService";
import { postObservationPeriod } from "../../services/observationStationService";
import { postAddObservation } from "../../services/observationlistService";
import { parse, resetAll } from "../../shorthand/shorthand";

const timeRegex = new RegExp(/^(([01]?[0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

let day = {
  day: "",
  comment: "",
  observers: "",
  observatory_id: ""
};

let observationPeriods = [];

let observationPeriod = {
  location: "",
  startTime: "",
  endTime: "",
  observationType: "",
  day_id: ""
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
  return String(row).match(timeRegex);
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

const sendObservation = async (observation, observationPeriodId) => {
  observation["observationperiod_id"] = observationPeriodId;
  const res = await postAddObservation(observation);
  console.log("obs res", res);
};

export const sendDay = async (paramDay) => {
  day = { ...paramDay };
  const res = await postDay(day);
  console.log("day res", res);
  day["id"] = res.data.id;
};

export const loopThroughObservationPeriods = async (shorthandRows, obsType, loc) => {
  observationPeriods = [];
  let startTimeEncountered = false;
  for (const row of shorthandRows) {
    if (!row) continue;
    if (isTime(row) && !startTimeEncountered) {
      startTimeEncountered = true;
      observationPeriod["startTime"] = parseTime(row);
    } else if (isTime(row)) {
      startTimeEncountered = false;
      observationPeriod["endTime"] = parseTime(row);
      observationPeriods.push({ ...observationPeriod });
    }
  }
  for (const observationPeriod of observationPeriods) {
    observationPeriod["observationType"] = obsType;
    observationPeriod["location"] = loc;
    observationPeriod["day_id"] = day["id"];
    const res = await postObservationPeriod(observationPeriod);
    console.log("obsperiod res", res);
    observationPeriod["id"] = res.data.id;
  }
};

const toNum = (field) => {
  observation[String(field)]
    = observation[String(field)]
      ? Number(observation[String(field)])
      : 0;
};

export const loopThroughObservations = async (shorthandRows) => {
  let startTimeEncountered = false;
  let i = 0;
  for (const row of shorthandRows) {
    if (!row) continue;
    if (isTime(row) && !startTimeEncountered) {
      startTimeEncountered = true;
    } else if (isTime(row)) {
      startTimeEncountered = false;
      i++;
    } else {
      const parsed = parse(row);
      for (const sub of parsed.osahavainnot) {
        observation = sub;
        observation.species = parsed.species;
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
        await sendObservation(observation, observationPeriods[Number(i)]["id"]);
      }
      resetAll();
    }
  }
};
