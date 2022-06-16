import { getDaysObservationPeriods } from "../services";
import { isTime, parseTime } from "./timeHelper.js";

export const observationsOnTop = async (dayId,value) => {

  let periodStartTime = null;
  let periodEndTime = null;
  let nextTimeEndTime = false;

  const observationPeriods = await getDaysObservationPeriods(dayId);

  const lines = value.trim().split(/\n/);

  let rowNumbers = [];

  let rowNumber = 1;

  for (const line of lines) {

    let parsedTime = isTime(line) && parseTime(line);
    nextTimeEndTime = !parsedTime && true;

    periodStartTime = !nextTimeEndTime && parsedTime;

    periodEndTime = nextTimeEndTime && parsedTime;

    for (const obsPeriod of observationPeriods) {

      if (periodEndTime >= obsPeriod.startTime && periodStartTime <= obsPeriod.startTime ||
        periodEndTime >= obsPeriod.startTime && periodEndTime <= obsPeriod.endTime ||
          periodStartTime >= obsPeriod.startTime && periodStartTime <= obsPeriod.endTime) {
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