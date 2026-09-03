import { isTime, parseTime } from "../utils";

interface ObservationPeriod {
    id: number;
    startTime: string;
    endTime: string;
    observationType: string;
}

export const getOverlappingTimeRows = (value: string, observationPeriods: ObservationPeriod[], activeObservationPeriodIds: number[]) => {
  const rowNumbers = [];

  observationPeriods = observationPeriods.filter(
    period => !(activeObservationPeriodIds || []).includes(period.id) && !["Paikallinen", "Hajahavainto"].includes(period.observationType)
  );

  const lines = value.trim().split(/\n/);

  let rowNumber = 1;
  let periodStartTime = null;
  let periodEndTime = null;
  let nextTimeEndTime = false;

  for (let line of lines) {
    line = line.trim();

    const parsedTime = isTime(line) && parseTime(line);

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
      if (!periodStartTime || !periodEndTime) {
        continue;
      }

      if (
        periodEndTime > obsPeriod.startTime && periodStartTime <= obsPeriod.startTime ||
        periodEndTime > obsPeriod.startTime && periodEndTime <= obsPeriod.endTime ||
        periodStartTime >= obsPeriod.startTime && periodStartTime < obsPeriod.endTime
      ) {
        rowNumbers.push(rowNumber);
      }
    }

    rowNumber++;
  }

  return rowNumbers;
};
