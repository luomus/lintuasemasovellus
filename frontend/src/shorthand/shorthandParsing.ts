import { isTime, parseTime } from "./utils";
import { FullObservation, parseLine } from "./observationParsing";
import { validateShorthandLines } from "./validation/validation";

interface ObservationPeriod {
    location: string;
    startTime: string;
    endTime: string;
    shorthandBlock: string;
    observationType: string;
}

interface PeriodObservation extends FullObservation {
    periodOrderNum: string;
}

export const shorthandTextToLines = (shorthandText: string): string[] => (
  shorthandText.trim().split(/\n/)
);

export const shorthandLinesToObservations = (shorthandLines: string[], obsType: string, loc: string): { observationPeriods: ObservationPeriod[]; observations: PeriodObservation[] } => {
  const errors = validateShorthandLines(shorthandLines);
  if (errors.length > 0) {
    throw new Error(errors[0][1]);
  }

  const observationPeriods: ObservationPeriod[] = [];
  const observations: PeriodObservation[] = [];

  let periodStartTime: string;
  let periodShorthandBlock = "";
  let periodIdx = 0;

  for (const row of shorthandLines) {
    if (!row) continue;

    if (isTime(row)) {
      if (!periodShorthandBlock) {
        periodStartTime = parseTime(row);
      } else {
        observationPeriods.push({
          location: loc,
          startTime: periodStartTime!,
          endTime: parseTime(row),
          shorthandBlock: periodShorthandBlock,
          observationType: obsType
        });

        periodStartTime = parseTime(row);
        periodShorthandBlock = "";
        periodIdx++;
      }
    } else {
      if (periodShorthandBlock === "") {
        periodShorthandBlock = row;
      } else {
        periodShorthandBlock = periodShorthandBlock + "\n" + row;
      }

      if (!(row.trim() === "tauko" || row.trim() === "-")) {
        const observationObject: PeriodObservation = { ...parseLine(row), periodOrderNum: String(periodIdx) };
        observations.push(observationObject);
      }
    }
  }

  return { observationPeriods, observations };
};
