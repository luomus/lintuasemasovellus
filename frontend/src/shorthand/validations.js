import { parse, resetAll } from "./shorthand";
import birds from "./birds.json";


const timeRegex = new RegExp(/^(([01]?[0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

let errors = [];

const birdMap = new Map(Object.entries(birds));

export const isTime = (row) => {
  return String(row).trim().match(timeRegex);
};

const notInBirds = (speciesName) => {
  return !birdMap.has(speciesName.toUpperCase());
};

export const checkWholeInputLine = (rowNumber, row) => {
  if (!row) return;
  try {
    const parsed = parse(row);
    if (notInBirds(parsed.species)) {
      throw new Error("Tuntematon lajin nimi!");
    }
  } catch (error) {
    errors.push(`Error in line ${rowNumber + 1}, ${row}: ${error.message}`);
  }
  resetAll();
};

export const loopThroughCheckForErrors = (shorthandRawText) => {
  const lines = shorthandRawText.split("\n");
  let timeEncountered = false;
  let noTimes = true;
  for (let i = 0; i < lines.length; i++) {
    if (isTime(lines[Number(i)])) {
      timeEncountered = !timeEncountered;
      noTimes = false;
    } else {
      checkWholeInputLine(i, lines[Number(i)]);
    }
  }
  if (timeEncountered) {
    errors.push("Pariton määrä aikoja!");
  }
  if (noTimes) {
    errors.push("Ajat puuttuvat");
  }
};

export const getErrors = () => {
  return errors;
};

export const resetErrors = () => {
  errors = [];
};
