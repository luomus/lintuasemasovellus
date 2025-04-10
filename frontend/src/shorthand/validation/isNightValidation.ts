import { isNightTime } from "../../nocturnalMigration/checkNightTime.js";
import { isTime, parseTime } from "../utils";

const parseTimeForNightValidation = (timeString: string) => {
  const t = timeString;
  const ms = Number(t.split(/[.:]/)[0]) * 60 * 60 * 1000 + Number(t.split(/[.:]/)[1]) * 60 * 1000;
  return ms;
};

export const isNightValidation = (observatory: string, value: string, date: Date) => {
  const lines = value.trim().split(/\n/);

  const rowNumbers = [];

  let rowNumber = 1;

  for (const line of lines) {
    const parsedTime = isTime(line) && parseTime(line);

    const ms = parsedTime && parseTimeForNightValidation(parsedTime);

    ms && date.setHours(0,0,0,ms);

    if(!isNightTime(observatory,date) && isTime(line)) {
      rowNumbers.push(rowNumber);
    }

    rowNumber++;
  }

  return rowNumbers;
};
