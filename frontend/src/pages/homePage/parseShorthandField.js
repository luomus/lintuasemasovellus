import { postDay } from "../../services/dayService";
import { postObservationPeriod } from "../../services/observationStationService";
import { postAddObservation } from "../../services/observationlistService";
import { parse } from "../../shorthand/shorthand";

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
  adultUnknownCount: "",
  adultFemaleCount: "",
  adultMaleCount: "",
  juvenileUnknownCount: "",
  juvenileFemaleCount: "",
  juvenileMaleCount: "",
  subadultUnknownCount: "",
  subadultFemaleCount: "",
  subadultMaleCount: "",
  unknownUnknownCount: "",
  direction: "",
  bypassSide: "",
  notes: "",
  observationperiod_id: ""
};

const isTime = (row) => {
  return row.match(timeRegex);
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
  observation["observation_id"] = observationPeriodId;
  const res = await postAddObservation(observation);
  console.log("obs res", res);
};

export const sendDay = async (paramDay) => {
  day = { ...paramDay };
  const res = await postDay(day);
  console.log("day res", res);
  day["id"] = res.data.id;
};

export const loopThroughObservationPeriods = async (shorthandRows, obsType, loc, dayId) => {
  observationPeriods = [];
  let startTimeEncountered = false;
  for (const row of shorthandRows) {
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
    observationPeriod["day_id"] = dayId;
    const res = await postObservationPeriod(observationPeriod);
    console.log("obsperiod res", res);
    observationPeriod["id"] = res.data.id;
  }
};

export const loopThroughObservations = async (shorthandRows) => {
  let startTimeEncountered = false;
  let i = 0;
  for (const row of shorthandRows) {
    if (isTime() && !startTimeEncountered) {
      startTimeEncountered = true;
      observation = parse(row);
    } else {
      startTimeEncountered = false;
      await sendObservation(observation, observationPeriod[Number(i)]["id"]);
    }
    i++;
  }
};
