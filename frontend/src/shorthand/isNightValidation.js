import { isTime, parseTime, parseTimeForNightValidation } from "./timeHelper.js";
import { isNightTime } from "../nocturnalMigration/checkNightTime.js";

export const isNightValidation = (observatory, value) => {

  const lines = value.trim().split(/\n/);

  const date = new Date();

  for (const line of lines) {
    let parsedTime = isTime(line) && parseTime(line);

    const ms = parsedTime && parseTimeForNightValidation(parsedTime);

    ms && date.setHours(0,0,0,ms);

    if(isNightTime(observatory,date)) {
      console.log("Huomio yö kellon aika!");
    }

  }


};