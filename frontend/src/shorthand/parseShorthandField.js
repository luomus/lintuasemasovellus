import { sendEverything } from "../services/dayService";
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

let shorthand = {
  block: "",
  //observationperiod_id: 0
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

//Not used anywhere?
export const sendShorthand = async (data) => {
  return await sendEverything(data);
};


const sendObservation = async (observation, userID) => {
  observation["species"] = Object.values(globals.birdMap.get(observation["species"].toUpperCase()))[0];
  observation["direction"] = globals.directions.get(observation["direction"].toUpperCase());
  observation["bypassSide"] = globals.bypass.get(observation["bypassSide"]);
  observation["account_id"] = userID;
  return observation;
  //await postAddObservation(observation);
};

//Becomes useless after sendEverything
// export const sendDay = async (paramDay) => {
//   day = { ...paramDay };
//   const res = await postDay(day);
//   day["id"] = res.data.id;
// };

//Becomes useless after sendEverything,
//remember to edit backend to add dayID to catches before saving to DB!!
// export const sendCatches = async (catches) => {
//   const catchesToSend = [day["id"], ...catches];
//   console.log("catchesToSend:", catchesToSend);
//   const res = await postCatches(catchesToSend);
//   console.log(res);
// };


//remmebre to add dayID to periods in backend
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
      observationPeriod["observationType"] = obsType;
      observationPeriod["location"] = loc;
      observationPeriods.push({ ...observationPeriod });
    }
  }

  /*
  for (const observationPeriod of observationPeriods) {
    observationPeriod["observationType"] = obsType;
    observationPeriod["location"] = loc;
    //observationPeriod["day_id"] = day["id"];
    // const res = await postObservationPeriod(observationPeriod);
    // observationPeriod["id"] = res.data.id;
  }
  */
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

export const loopThroughObservations = async (shorthandRows, userID) => {
  let startTimeEncountered = false;
  let i = 0;
  const observations = [];// [ i: { shorthadRow: row, subObservations: []  }]
  for (const row of shorthandRows) {
    if (!row) continue;
    if (isTime(row) && !startTimeEncountered) {
      startTimeEncountered = true;
    } else if (isTime(row)) {
      startTimeEncountered = false;
      i++;
    } else {
      observations[String(i)].shorthandRow = row;
      const parsed = parse(row);
      shorthand["block"] = row;
      shorthand["observationperiod_id"] = observationPeriods[Number(i)]["id"];
      //const res = await postAddShorthand(shorthand);
      for (const sub of parsed.osahavainnot) {
        observation = sub;
        observation.species = parsed.species;
        obsCountersToNum();
        //await sendObservation(observation, observationPeriods[Number(i)]["id"], res.data.id, userID);
        observations[String(i)].subObservations.push(sendObservation(observation, userID));
      }
      resetAll();
    }
  }
  return observations;
};
