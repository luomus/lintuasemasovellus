import { isTime, parseTime, parseTimeForNightValidation } from "./timeHelper.js";
import { isNightTime } from "../nocturnalMigration/checkNightTime.js";

export const isNightValidation = (observatory, value, date) => {

  const lines = value.trim().split(/\n/);

  let rowNumbers = [];

  let rowNumber = 1;

  for (const line of lines) {
    let parsedTime = isTime(line) && parseTime(line);

    const ms = parsedTime && parseTimeForNightValidation(parsedTime);

    ms && date.setHours(0,0,0,ms);


    if(!isNightTime(observatory,date) && isTime(line)) {
      rowNumbers.push(rowNumber);
    }

    rowNumber++;

  }

  return rowNumbers;


};