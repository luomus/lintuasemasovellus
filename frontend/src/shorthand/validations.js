import { parse, resetAll } from "./shorthand";
import birdJson from "./birds.json";

const birds = new Set(Object.keys(birdJson));

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
 * In order to allow for multilines, use the species'
 * name to divide "observation lines" from each other for
 * the parser.
 * @param {string} text
 */
const sanitize = (text) => {
  const tidbits = text.trim().split(/\s+/);
  let times = 0;
  let ret = [];
  let line = ""; let birdFound = false;
  for (const tidbit of tidbits) {
    if (isTime(tidbit)) {
      ++times;
      if (line) ret.push(line);
      line = tidbit;
    } else if (times & 1) {
      if (birds.has(tidbit.toUpperCase())) {
        birdFound = true;
        ret.push(line);
        line = tidbit + " ";
      } else {
        line += tidbit;
      }
    } else {
      return "Havaintorivien täytyy olla aikojen sisällä";
    }
  }
  ret.push(line);
  if (!birdFound) {
    return "Tuntematon lajinnimi! (erotithan linnut välilyönnillä, tabilla tai rivinvaihdolla)";
  } else if (times & 1) {
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
