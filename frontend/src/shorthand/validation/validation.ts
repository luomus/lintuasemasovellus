import { isTime, parseTime, timeStringToFloat } from "../utils";
import { parseLine } from "../observationParsing";

/**
 * Loop through the entire shorthand text and use the algorithm to check each
 * line for errors.
 * @param {string} lines
 * @param {object} speciesCodeMap
 */
export const validateShorthandLines = (lines: string[], speciesCodeMap: Map<string, string>): [number, string][] => {
  const errors: [number, string][] = [];

  let timeEncountered = false;
  let observationsEncountered = false;

  let endsWithTime = true;
  let periodStartTime: string|null = null;
  let periodContainsLines = false;
  let pauseIsActive = false;
  let emptyPeriod = false;
  let consecutiveTimes = 0;

  for (let rowNumber = 0; rowNumber < lines.length; rowNumber++) {
    const trimmedLine = lines[rowNumber].trim();

    if (trimmedLine.length === 0) {
      rowNumber++;
      continue;
    }

    if (isTime(trimmedLine)) {
      // CHECK TIMES

      const parsedTime = parseTime(trimmedLine);

      if (timeEncountered) {
        endsWithTime = true;
      } else {
        timeEncountered = true;
      }

      if (periodStartTime) {
        if (periodContainsLines || pauseIsActive || emptyPeriod) {
          if (timeStringToFloat(periodStartTime) === timeStringToFloat(parsedTime)) {
            errors.push([rowNumber, "periodsTimesMustBeDifferent"]);
          } else if (timeStringToFloat(periodStartTime) > timeStringToFloat(parsedTime)) {
            errors.push([rowNumber, "periodsEndTimeMustBeAfterStartTime"]);
          }
        } else {
          if (timeStringToFloat(periodStartTime) > timeStringToFloat(parsedTime)) {
            errors.push([rowNumber, "periodsStartTimeMustBeAfterPreviousEndTime"]);
          }
          if (consecutiveTimes > 1) {
            errors.push([rowNumber - 1, "periodContainsNothing"]);
          }
        }
      }

      periodStartTime = parsedTime;
      periodContainsLines = false;
      pauseIsActive = false;
      emptyPeriod = false;
      consecutiveTimes++;
    } else {
      if (!timeEncountered) {
        errors.push([rowNumber, "startTimeMissing"]);
      }

      if (trimmedLine === "tauko") {
        // CHECK PAUSES

        if (periodContainsLines) {
          errors.push([rowNumber, "noObservationsDuringPause"]);
        }

        if (pauseIsActive) {
          errors.push([rowNumber, "pauseAlreadyActive"]);
        }

        if (emptyPeriod) {
          errors.push([rowNumber, "noPauseDuringEmptyPeriod"]);
        }

        pauseIsActive = true;
      } else if (trimmedLine === "-") {
        // CHECK EMPTY

        if (periodContainsLines) {
          errors.push([rowNumber, "noObservationsDuringEmptyPeriod"]);
        }

        if (pauseIsActive) {
          errors.push([rowNumber, "noEmptyDuringPause"]);
        }

        if (emptyPeriod) {
          errors.push([rowNumber, "alreadyEmpty"]);
        }

        emptyPeriod = true;
        observationsEncountered = true;
      } else {
        // CHECK OTHER LINES

        if (pauseIsActive) {
          errors.push([rowNumber, "noObservationsDuringPause"]);
        }

        if (emptyPeriod) {
          errors.push([rowNumber, "noObservationsDuringEmptyPeriod"]);
        }

        // Push errors in observation line
        try {
          parseLine(trimmedLine, speciesCodeMap);
        } catch (error: unknown) {
          if (error instanceof Error) {
            errors.push([rowNumber, `${error.message}`]);
          } else {
            throw error;
          }
        }

        periodContainsLines = true;
        observationsEncountered = true;
      }

      endsWithTime = false;
      consecutiveTimes = 0;
    }
  }

  if (!endsWithTime && observationsEncountered) {
    errors.push([lines.length - 1, "mustEndWithTime"]);
  }

  if (consecutiveTimes > 1) {
    errors.push([lines.length - 2, "periodContainsNothing"]);
  }

  if (!observationsEncountered && lines.some(line => !!line)) {
    errors.push([lines.length - 1, "noObservations"]);
  }

  return errors;
};
