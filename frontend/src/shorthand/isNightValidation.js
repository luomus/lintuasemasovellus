import { isTime, parseTime, parseTimeForNightValidation } from "./timeHelper.js";
import { isNightTime } from "../nocturnalMigration/checkNightTime.js";

export const isNightValidation = (observatory, value, date) => {
  console.log("observatory: ", observatory);

  const lines = value.trim().split(/\n/);

  console.log("lines: ", lines);

  const localTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  console.log("local time: ", localTime);

  for (const line of lines) {
    let parsedTime = isTime(line) && parseTime(line);
    console.log("parsed time: ", parsedTime);
    console.log(isNightTime(observatory, date));

    // add parseTimeForNightValidation(parsedTime) into localTime
    const totalTime = parsedTime && parseTimeForNightValidation(parsedTime) + localTime;
    console.log("total time: ", totalTime);
    if (isNightTime(observatory,totalTime)) {
      console.log("is night time");
    }
    // check whether isNightTime()
  }


};