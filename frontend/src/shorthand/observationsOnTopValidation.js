import { getDaysObservationPeriods } from "../services";
import { isTime, parseTime } from "./timeHelper.js";

export const observationsOnTop = async (dayId,value) => {

  let periodStartTime = null;
  let periodEndTime = null;
  let nextTimeEndTime = false;

  let observationPeriods = await getDaysObservationPeriods(dayId);

  const lines = value.trim().split(/\n/);

  let rowNumbers = [];

  let rowNumber = 1;

  for (const line of lines) {

    let parsedTime = isTime(line) && parseTime(line);
    nextTimeEndTime = !parsedTime && true;

    periodStartTime = !nextTimeEndTime && parsedTime;

    periodEndTime = nextTimeEndTime && parsedTime;

    for (const obsPeriod of observationPeriods) {

      if (periodEndTime >= obsPeriod.startTime && periodStartTime <= obsPeriod.startTime && obsPeriod.observationType !== "Paikallinen" && obsPeriod.observationType !== "Hajahavainto" ||
        periodEndTime >= obsPeriod.startTime && periodEndTime <= obsPeriod.endTime  && obsPeriod.observationType !== "Paikallinen" && obsPeriod.observationType !== "Hajahavainto" ||
          periodStartTime >= obsPeriod.startTime && periodStartTime <= obsPeriod.endTime  && obsPeriod.observationType !== "Paikallinen" && obsPeriod.observationType !== "Hajahavainto" ) {
        console.log("obsPeriod: ", obsPeriod);
        rowNumbers.push(rowNumber);
      }
    }

    periodEndTime = periodEndTime && null;
    periodStartTime = null;
    periodEndTime = null;
    rowNumber++;
  }
  return rowNumbers;
};