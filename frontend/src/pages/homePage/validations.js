import { parse, resetAll } from "../../shorthand/shorthand";
import birds from "./birds.json";


const timeRegex = new RegExp(/^(([01]?[0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

let errors = [];

export let timelines = new Set();

export const isTime = (row) => {
  return String(row).trim().match(timeRegex);
};

const birdSet = new Set(Object.entries(birds));

const isInBirds = (speciesName) => {
  return birdSet.has(speciesName.toUpperCase());
};

export const checkWholeInputLine = (rowNumber, row) => {
  if (!row) return;
  try {
    const parsed = parse(row);
    if (!isInBirds(parsed.species)) {
      throw new Error("Tuntematon lajin nimi!");
    }
    console.log("parsed stuff:", parsed);
  } catch (error) {
    errors.push(`Error in line ${rowNumber + 1}, ${row}: ${error.message}`);
  }
  resetAll();
};

export const loopThroughCheckForErrors = (shorthandRawText) => {
  const lines = shorthandRawText.split("\n");
  let timeEncountered = false;
  for (let i = 0; i < lines.length; i++) {
    if (isTime(lines[Number(i)])) {
      timeEncountered = !timeEncountered;
    } else {
      checkWholeInputLine(i, lines[Number(i)]);
    }
  }
  if (timeEncountered) {
    errors.push("Pariton määrä aikoja!");
  }
  return true;
};

export const getErrors = () => {
  return errors;
};

export const resetErrors = () => {
  errors = [];
};
