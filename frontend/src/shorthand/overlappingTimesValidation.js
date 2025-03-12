import { isTime, parseTime } from "./timeHelper.js";

export const getOverlappingTimeRows = (value, observationPeriods, activeObservationPeriodIds) => {
  let rowNumbers = [];

  observationPeriods = observationPeriods.filter(
    period => !(activeObservationPeriodIds || []).includes(period.id)
  );

  const lines = value.trim().split(/\n/);

  let rowNumber = 1;
  let periodStartTime = null;
  let periodEndTime = null;
  let nextTimeEndTime = false;

  for (const line of lines) {
    let parsedTime = isTime(line) && parseTime(line);

    if (parsedTime || !nextTimeEndTime) {
      if (nextTimeEndTime) {
        periodEndTime = parsedTime;
        nextTimeEndTime = false;
      } else {
        periodStartTime = parsedTime || periodEndTime;
        periodEndTime = null;
        nextTimeEndTime = true;
      }
    } else {
      rowNumber++;
      continue;
    }

    for (const obsPeriod of observationPeriods) {
      if (periodEndTime > obsPeriod.startTime && periodStartTime <= obsPeriod.startTime && obsPeriod.observationType !== "Paikallinen" && obsPeriod.observationType !== "Hajahavainto" ||
        periodEndTime > obsPeriod.startTime && periodEndTime <= obsPeriod.endTime  && obsPeriod.observationType !== "Paikallinen" && obsPeriod.observationType !== "Hajahavainto" ||
          periodStartTime >= obsPeriod.startTime && periodStartTime < obsPeriod.endTime  && obsPeriod.observationType !== "Paikallinen" && obsPeriod.observationType !== "Hajahavainto" ) {
        rowNumbers.push(rowNumber);
      }
    }

    rowNumber++;
  }

  return rowNumbers;
};
