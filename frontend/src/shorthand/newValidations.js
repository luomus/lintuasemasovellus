import ObservationParser from "./observationParser";
import { isTime, parseTime, parseTimeForComparison } from "./timeHelper.js";

/**
 * Loop through the entire shorthand text and use the algorithm to check each
 * line for errors.
 * @param {string} lines
 */
export const validateShorthandLines = (lines) => {
  const parser = ObservationParser();
  const errors = [];
  let shortHandContainsMoreThanTimes = false;
  let emptyPeriod = false;
  let timeEncountered = false;
  let observationsEncountered = false;
  let endsWithTime = true;
  let periodContainsLines = false;
  let pauseIsActive = false;
  let periodStartTime = null;
  //let previousLine = "";
  let rowNumber = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.length === 0) {

      // SKIP EMPTY LINES
      rowNumber++;
      continue;

    }

    if (isTime(trimmedLine)) {

      // CHECK TIMES

      let parsedTime = parseTime(trimmedLine);

      if (timeEncountered) {
        endsWithTime = true;
      } else {
        timeEncountered = true;
        endsWithTime = false;
      }


      if (periodStartTime && periodContainsLines && (parseTimeForComparison(periodStartTime) === parseTimeForComparison(parsedTime))) {
        errors.push([rowNumber, "periodsTimesMustBeDifferent"]);
      }

      // Push error, if time is before current start time
      if (periodStartTime && periodContainsLines && (parseTimeForComparison(periodStartTime) > parseTimeForComparison(parsedTime))) {
        errors.push([rowNumber, "periodsEndTimeMustBeAfterStartTime"]);
      } else {
        periodStartTime = parsedTime;
        periodContainsLines = false;
        pauseIsActive = false;
        emptyPeriod = false;
      }

    } else if (trimmedLine === "tauko") {

      // CHECK PAUSES

      // Push error, if doesn't start with time
      if (!timeEncountered) {
        errors.push([rowNumber, "startTimeMissing"]);
      }

      // Push error, if tauko is already active
      if (pauseIsActive) {
        errors.push([rowNumber, "pauseAlreadyActive"]);
      }

      // Push error, if period should be empty
      if (emptyPeriod) {
        errors.push([rowNumber, "noPauseDuringEmptyPeriod"]);
      }

      // Push error, if period contains something before pause line
      if (periodContainsLines) {
        errors.push([rowNumber, "noObservationsDuringPause"]);
      }

      pauseIsActive = true;
      periodStartTime = null;
      endsWithTime = false;

    } else if (trimmedLine === "-") {

      // CHECK EMPTY

      // Push error, if doesn't start with time
      if (!timeEncountered) {
        errors.push([rowNumber, "startTimeMissing"]);
      }

      // Push error, if is already marked empty
      if (emptyPeriod) {
        errors.push([rowNumber, "alreadyEmpty"]);
      }

      // Push error, if period should be pause
      if (pauseIsActive) {
        errors.push([rowNumber, "noEmptyDuringPause"]);
      }

      // Push error, if period contains something before empty line
      if (periodContainsLines) {
        errors.push([rowNumber, "noObservationsDuringEmptyPeriod"]);
      }

      emptyPeriod = true;
      periodContainsLines = true;
      shortHandContainsMoreThanTimes = true;
      endsWithTime = false;

    } else {

      // CHECK OTHER LINES

      // Push error, if period has been marked empty
      if(emptyPeriod) {
        errors.push([rowNumber, "noObservationsDuringEmptyPeriod"]);
      }

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
        parser.parse(line);
        observationsEncountered = true;
      } catch (error) {
        errors.push([rowNumber, `${error.message}`]);
      }
      parser.resetAll();

      periodContainsLines = true;
      shortHandContainsMoreThanTimes = true;
      endsWithTime = false;

    }

    // previousLine = line;
    rowNumber++;
  }

  // Push error if doesn't end with time
  if (!endsWithTime && observationsEncountered) {
    errors.push([rowNumber - 1, "mustEndWithTime"]);
  }

  if (!shortHandContainsMoreThanTimes && lines.some(line => !!line)) {
    errors.push([rowNumber - 1, "noObservations"]);
  }

  return errors;
};
