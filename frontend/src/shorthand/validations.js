import { parse, resetAll } from "./shorthand";

const timeRegex = new RegExp(/^(([01]?[0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

let errors = [];

export const isTime = (row) => {
  return String(row).trim().match(timeRegex);
};

export const checkWholeInputLine = (rowNumber, row) => {
  if (!row) return;
  try {
    parse(row);
  } catch (error) {
    errors.push(`Error in line ${rowNumber + 1}, ${row}: ${error.message}`);
  }
  resetAll();
};

/**
 * Loop through the entire shorthand text and use the algorithm to check each
 * line for errors.
 * @param {string} shorthandRawText
 */
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
