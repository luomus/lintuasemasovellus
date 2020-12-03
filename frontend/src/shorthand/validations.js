import { parse, resetAll } from "./shorthand";

const timeRegex = new RegExp(/^(([01]?[0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

let errors = [];

const isTime = (row) => {
  return String(row).trim().match(timeRegex);
};

const checkWholeInputLine = (rowNumber, row) => {
  if (!row) return;
  try {
    parse(row);
  } catch (error) {
    errors.push(`Error in line ${rowNumber + 1}, ${row}: ${error.message}`);
  }
  resetAll();
};

/**
 * Split the text on newlines, and check that all lines are contained
 * in-between times of day.
 * @param {string} text
 */
const sanitize = (text) => {
  const lines = text.trim().split(/\n/);
  let times = 0;
  let ret = [];
  for (const line of lines) {
    if (isTime(line)) {
      ++times;
      ret.push(line);
    } else if (times & 1) {
      ret.push(line);
    } else {
      return "Havaintorivien täytyy olla aikojen sisällä";
    }
  }
  if (times & 1) {
    return "Pariton määrä aikoja!";
  } else {
    return ret;
  }
};

/**
 * Loop through the entire shorthand text and use the algorithm to check each
 * line for errors.
 * @param {string} shorthandRawText
 */
export const loopThroughCheckForErrors = (shorthandRawText) => {
  const lines = sanitize(shorthandRawText);
  if (typeof lines === "string") {
    errors.push(lines);
    return null;
  }
  for (let i = 0; i < lines.length; i++) {
    if (!isTime(lines[Number(i)])) {
      checkWholeInputLine(i, lines[Number(i)]);
    }
  }
  return lines;
};

export const getErrors = () => {
  return errors;
};

export const resetErrors = () => {
  errors = [];
};
