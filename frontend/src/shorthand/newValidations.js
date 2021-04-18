import { parse, resetAll } from "./shorthand";
import { isTime, parseTime } from "./timeHelper.js";

let errors = [];

/**
 * Loop through the entire shorthand text and use the algorithm to check each
 * line for errors.
 * @param {string} shorthandRawText
 */
export const loopThroughCheckForErrors = (shorthandRawText) => {
  const lines = shorthandRawText.trim().split(/\n/);
  let timeEncountered = false;
  let observationsEncountered = false;
  let endsWithTime = true;
  let periodContainsLines = false;
  let pauseIsActive = false;
  let periodStartTime = null;
  //let previousLine = "";
  let ret = [];
  let rowNumber = 0;

  for (const line of lines) {
    if (line.trim().length === 0) {

      // SKIP EMPTY LINES
      ret.push(line);
      rowNumber++;
      continue;

    }

    if (isTime(line)) {

      // CHECK TIMES

      let parsedTime = parseTime(line);

      if (timeEncountered) {
        endsWithTime = false !== true;
        console.log(endsWithTime);
      } else {
        timeEncountered = true;
        endsWithTime = false;
      }

      // Push error, if time is before current start time
      if (periodStartTime && (periodStartTime > parsedTime)) {
        errors.push([rowNumber, "periodsEndTimeMustBeAfterStartTime"]);
      } else {
        periodStartTime = parsedTime;
        periodContainsLines = false;
        pauseIsActive = false;
      }

    } else if (line.trim() === "tauko") {

      // CHECK PAUSES

      // Push error, if doesn't start with time
      if (!timeEncountered) {
        errors.push([rowNumber, "startTimeMissing"]);
      }

      // Push error, if period contains something before pause line
      if (periodContainsLines) {
        errors.push([rowNumber, "noObservationsDuringPause"]);
      }

      pauseIsActive = true;
      periodStartTime = null;

    } else {

      // CHECK OTHER LINES

      // Push error, if doesn't start with time
      if (!timeEncountered) {
        errors.push([rowNumber, "startTimeMissing"]);
      }

      // Push error, if pause is active and observation is given
      if (pauseIsActive) {
        errors.push([rowNumber, "noObservationsDuringPause"]);
      }

      // Push errors in observation line
      try {
        parse(line);
        observationsEncountered = true;
      } catch (error) {
        errors.push([rowNumber, `${error.message}`]);
      }
      resetAll();

      periodContainsLines = true;
      endsWithTime = false;

    }

    ret.push(line);
    // previousLine = line;
    rowNumber++;
  }

  // Push error if doesn't end with time
  if (observationsEncountered && !endsWithTime) {
    errors.push([rowNumber - 1, "mustEndWithTime"]);
  }

  return ret;
};

export const getErrors = () => {
  return errors;
};

export const resetErrors = () => {
  errors = [];
};