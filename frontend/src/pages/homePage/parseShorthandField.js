import { postDay } from "../../services/dayService";
import { postObservationPeriod } from "../../services/observationStationService";
import { postAddObservation } from "../../services/observationlistService";
import { parse } from "../../shorthand/shorthand";

const timeRegex = new RegExp(/^(([01][0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

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
    observationperiod_id: "",
};

const isTime = (row) => {
    return row.match(timeRegex);
};

const parseTime = (timeString) => {
    //new Date()
    return timeString;
};

const sendObservation = async (observation, observationPeriodId) => {
    observation["observation_id"] = observationPeriodId;
    const res = await postAddObservation(observation);
};

export const sendDay = async (pday) => {
    day = pday;
    const res = await postDay(day);
    day["id"] = res.id;
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
            observationPeriods.append({ ...observationPeriod });
        }
    }
    for (const observationPeriod of observationPeriods) {
        observationPeriod["observationType"] = obsType;
        observationPeriod["location"] = loc;
        observationPeriod["day_id"] = dayId;
        const res = await postObservationPeriod(observationPeriod);
        observationPeriod["id"] = res.id;
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
            await sendObservation(observation, observationPeriod[i]["id"]);
        }
        i++;
    }
};
