import { parse, resetAll } from "./shorthand";
import globals from "../globalConstants";

const timeRegex = globals.timeRegex;

let errors = [];


const isTime = (row) => {
  return String(row).trim().match(timeRegex);
};

const checkWholeInputLine = (rowNumber, row) => {
  if (!row) return;
  try {
    parse(row);
  } catch (error) {
    errors.push([rowNumber, `Check row ${rowNumber + 1}: ${error.message}`]);
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
  let counter = 0;
  for (const line of lines) {
    if (line.length === 0) {
      ret.push(line);
    } else if (isTime(line)) {
      ++times;
      ret.push(line);
    } else if (times & 1) {
      ret.push(line);
    } else {
      errors.push([counter, "Start time missing!"]);
    }
    counter++;
  }
  if (times & 1) {
    errors.push([counter - 1, "Odd number of times!"]);
  }
  return ret;
};

/**
 * Loop through the entire shorthand text and use the algorithm to check each
 * line for errors.
 * @param {string} shorthandRawText
 */
export const loopThroughCheckForErrors = (shorthandRawText) => {
  const lines = sanitize(shorthandRawText);
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
