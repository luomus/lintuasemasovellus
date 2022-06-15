import { getDaysObservationPeriods } from "../services";
import { isTime, parseTime } from "./timeHelper.js";

export const observationsOnTop = async (dayId,value) => {

  console.log("value: ", value);

  let periodStartTime = null;
  let periodEndTime = null;
  let nextTimeEndTime = false;

  const observationPeriods = await getDaysObservationPeriods(dayId);

  const lines = value.trim().split(/\n/);

  for (const line of lines) {

    let parsedTime = isTime(line) && parseTime(line);
    nextTimeEndTime = !parsedTime && true;

    periodStartTime = !nextTimeEndTime && parsedTime;

    periodEndTime = nextTimeEndTime && parsedTime;

    console.log("periodStartTime: ", periodStartTime);
    console.log("periodEndTime: ", periodEndTime);

    for (const obsPeriod of observationPeriods) {

      if (periodEndTime >= obsPeriod.startTime && periodEndTime <= obsPeriod.endTime ||
          periodStartTime >= obsPeriod.startTime && periodStartTime <= obsPeriod.endTime) {
        console.log("obsPeriod: ", obsPeriod);
        console.log("is true");
        return true;
      }
    }

    periodEndTime = periodEndTime && null;
    periodStartTime = null;
    periodEndTime = null;


  }
  console.log("is false");
};