import globals from "../globalConstants";

// Buckets:

let firstSpaceOfLineBreakOrSomeSuchEncountered = false;
let lisatietobucketIsOpen = false;
let ageCanBeSet = true;
let lajinimi = "";

let lisatieto = "";
let yksilomaara = "";
let ika = "";

let ohituspuoli = "";
let ilmansuunta = "";
let sukupuoliRound = 2;

let slashes = 0;

let ageBucket = "unk";

let male = {
  "subad": "",
  "ad": "",
  "juv": "",
  "unk": ""
};

let female = {
  "subad": "",
  "ad": "",
  "juv": "",
  "unk": ""
};

let unknown = {
  "subad": "",
  "ad": "",
  "juv": "",
  "unk": ""
};

let osahavainnot = [];

let taysiHavainto = {};

// End of buckets

// Sets of acceptable substrings

const birds = globals.birdMap;

const possibleDirections = globals.directions;

const acceptableBypassSides = globals.bypass;

const acceptableIka = new Set(["subad", "ad", "juv", "'", "\""]);

const acceptableIkaChar = new Set(["j", "v", "b", "d", "e", "u", "s", "a"]);

const acceptlableIlmansuuntaChar = new Set(["n", "w", "e", "s"]);

// End sets of acceptable substrings

const openLisatietoBucket = () => {
  lisatietobucketIsOpen = true;
};

const closeLisatietoBucket = () => {
  lisatietobucketIsOpen = false;
};

const softReset = () => {
  yksilomaara = "";
  ika = "";
  ageBucket = "unk";
  sukupuoliRound = 2;
  ilmansuunta = "";
  ohituspuoli = "";
  lisatieto = "";
  slashes = 0;
  male = {
    "subad": "",
    "ad": "",
    "juv": "",
    "unk": ""
  };
  female = {
    "subad": "",
    "ad": "",
    "juv": "",
    "unk": ""
  };
  unknown = {
    "subad": "",
    "ad": "",
    "juv": "",
    "unk": ""
  };
};

const constructOsahavainto = () => {
  if (ika)
    throw new Error("Unknown age");
  if (!possibleDirections.has(ilmansuunta.toUpperCase()))
    throw new Error("Unknown direction");
  switch (sukupuoliRound) {
    case 0:
      male[String(ageBucket)] = yksilomaara;
      break;
    case 1:
      female[String(ageBucket)] = yksilomaara;
      break;
    case 2:
      unknown[String(ageBucket)] = yksilomaara;
      break;
    default:
      throw new Error("Unknown sex");
  }
  const osahavainto = {
    adultUnknownCount: unknown["ad"],
    adultFemaleCount: female["ad"],
    adultMaleCount: male["ad"],
    juvenileUnknownCount: unknown["juv"],
    juvenileFemaleCount: female["juv"],
    juvenileMaleCount: male["juv"],
    subadultUnknownCount: unknown["subad"],
    subadultFemaleCount: female["subad"],
    subadultMaleCount: male["subad"],
    unknownUnknownCount: unknown["unk"],
    unknownMaleCount: male["unk"],
    unknownFemaleCount: female["unk"],
    direction: ilmansuunta,
    bypassSide: ohituspuoli,
    notes: lisatieto
  };
  osahavainnot.push(osahavainto);
  softReset();
};

const ikaConstructed = () => {
  return acceptableIka.has(ika);
};

export const constructTaysiHavainto = (startKello, endKello) => {
  if (!birds.has(lajinimi.toUpperCase())) {
    throw new Error("Unknown species!");
  }
  constructOsahavainto();
  taysiHavainto = {
    species: lajinimi,
    startTime: startKello,
    endTime: endKello,
    osahavainnot
  };
};

const lajinimiNotSet = () => {
  return !firstSpaceOfLineBreakOrSomeSuchEncountered;
};

const setAgeBucket = () => {
  if (!ageCanBeSet) {
    throw new Error("One observation has multiple ages");
  }
  ageCanBeSet = false;
  if (ika === "'") {
    ageBucket = "juv";
  } else if (ika === "\"") {
    ageBucket = "ad";
  } else {
    ageBucket = ika;
  }
  ika = "";
};

const isNumeric = (string) => {
  if (typeof string !== "string") return false;
  return !isNaN(string) && !isNaN(parseInt(string));
};

const acceptableAroundIlmansuuntaHeuristic = (index, line) => {
  if (index === line.length - 1) return true;
  if (index === 0) return false;
  if (acceptableIkaChar.has(line[index + 1])) {
    return charIsProbablyDirection(line[index + 1]);
  }
  const nextNonSpaceyChar = line.substring(index + 1).trim()[0];
  if (nextNonSpaceyChar === ",") return true;
  if (isNumeric(nextNonSpaceyChar)) throw new Error("Number after direction");
  return true;
};

const fillSukupuoliBucketsSlash = () => {
  switch (sukupuoliRound) {
    case 0:
      break;
    case 1:
      female[String(ageBucket)] = yksilomaara;
      sukupuoliRound = 2;
      break;
    case 2:
      male["ad"] = unknown["ad"];
      male["juv"] = unknown["juv"];
      male["subad"] = unknown["subad"];
      male["unk"] = unknown["unk"];
      male[String(ageBucket)] = yksilomaara;
      unknown["ad"] = "";
      unknown["subad"] = "";
      unknown["juv"] = "";
      unknown["unk"] = "";
      sukupuoliRound = 1;
      break;
    default:
      throw new Error("Unknown sex");
  }
  yksilomaara = "";
  ageBucket = "unk";
};

const fillSukupuoliBucketsNotSlash = () => {
  switch (sukupuoliRound) {
    case 0:
      male[String(ageBucket)] = yksilomaara;
      break;
    case 1:
      female[String(ageBucket)] = yksilomaara;
      break;
    case 2:
      unknown[String(ageBucket)] = yksilomaara;
      break;
    default:
      throw new Error("Unknown sex");
  }
  yksilomaara = "";
  ageBucket = "unk";
};

const isTooManyCommasHeuristic = (index, line) => {
  const nextNonSpaceyChar = line.substring(index + 1).trim()[0];
  return nextNonSpaceyChar === ",";
};

const bypassSideIsLast = (index, line) => {
  if (index === line.length - 1) return true;
  const nextNonSpaceyChar = line.substring(index + 1).trim()[0];
  return nextNonSpaceyChar === "," || nextNonSpaceyChar === "+" || nextNonSpaceyChar === "-";
};

const charIsDefinitelyDirection = (char) => {
  return acceptlableIlmansuuntaChar.has(char) && !acceptableIkaChar.has(char);
};

const charIsProbablyDirection = (char) => {
  return char === "s" || char === "e";
};

const charIsMostLikelyDirection = (char) => {
  return charIsProbablyDirection(char) || charIsDefinitelyDirection(char);
};

const isDirection = (char, line, index) => {
  return charIsMostLikelyDirection(char) && acceptableAroundIlmansuuntaHeuristic(index, line);
};

const handleDefaultAlpha = (char, line, index) => {
  if (lajinimiNotSet()) {
    lajinimi += char;
  } else if (lisatietobucketIsOpen) {
    lisatieto += char;
  } else if (isDirection(char, line, index)) {
    ilmansuunta += char;
  } else if (acceptableIkaChar.has(char)) {
    ika += char;
  } else {
    throw new Error(`Unknown character: ${char}`);
  }
};

const handleSpaceySymbol = () => {
  firstSpaceOfLineBreakOrSomeSuchEncountered = true;
};

const handleNumeric = (char) => {
  if (lajinimiNotSet()) {
    throw new Error("Missing space after species name");
  }
  ageCanBeSet = true;
  yksilomaara += char;
};

const handleTimeSymbol = () => {
  throw new Error("Extra period or colon");
};

const handleBracketOpen = () => {
  if (lajinimiNotSet()) {
    throw new Error("Missing space after species name");
  }
  openLisatietoBucket();
};

const handleBracketClose = () => {
  if (lajinimiNotSet()) {
    throw new Error("Missing space after species name");
  }
  closeLisatietoBucket();
};

const handleComma = (line, index) => {
  if (lajinimiNotSet()) {
    throw new Error("Missing space after species name");
  }
  if (isTooManyCommasHeuristic(index, line)) {
    throw new Error("Extra commas");
  }
  constructOsahavainto();
};

const handleHipsu = (char) => {
  if (lajinimiNotSet()) {
    throw new Error("Missing space after species name");
  }
  ika += char;
};

const handlePlusMinus = (char, line, index) => {
  if (lajinimiNotSet()) {
    throw new Error("Missing space after species name");
  }
  if (!acceptableBypassSides.has(ohituspuoli += char)) {
    throw new Error("Unknown bypass side");
  }
  if (!bypassSideIsLast(index, line)) {
    throw new Error("Bypass side needs to come last");
  }
};

const handleSlash = () => {
  if (lajinimiNotSet()) {
    lajinimi += "/";
    return;
  }
  if (++slashes > 2) {
    throw new Error("Extra slashes");
  }
  fillSukupuoliBucketsSlash();
};

/**
 * Organize chars to buckets (i.e. separate strings).
 * @param {string} char
 * @param {string} line
 * @param {number} index
 */
const giveMeABucket = (char, line, index) => {
  switch (char) {
    default:
      handleDefaultAlpha(char, line, index);
      break;
    case " ": case "\t": case "\n":
      handleSpaceySymbol();
      break;
    case "0": case "1": case "2":
    case "3": case "4": case "5":
    case "6": case "7": case "8":
    case "9":
      handleNumeric(char);
      break;
    case ".": case ":":
      handleTimeSymbol();
      break;
    case "(":
      handleBracketOpen();
      break;
    case ")":
      handleBracketClose();
      break;
    case ",":
      handleComma(line, index);
      break;
    case "'": case "\"":
      handleHipsu(char);
      break;
    case "+": case "-":
      handlePlusMinus(char, line, index);
      break;
    case "/":
      handleSlash();
      break;
  }
  if (ikaConstructed()) {
    setAgeBucket();
    fillSukupuoliBucketsNotSlash();
  }
};

const getObservation = () => {
  return taysiHavainto;
};

/**
 * Reset buckets. Note that when error is thrown, the strings/buckets are
 * not emptied automatically.
 */
export const resetAll = () => {
  firstSpaceOfLineBreakOrSomeSuchEncountered = false;
  lisatietobucketIsOpen = false;
  lajinimi = "";
  lisatieto = "";
  yksilomaara = "";
  ika = "";
  ohituspuoli = "";
  ilmansuunta = "";
  sukupuoliRound = 2;
  slashes = 0;
  ageBucket = "unk";
  male = {
    "subad": "",
    "ad": "",
    "juv": "",
    "unk": ""
  };
  female = {
    "subad": "",
    "ad": "",
    "juv": "",
    "unk": ""
  };
  unknown = {
    "subad": "",
    "ad": "",
    "juv": "",
    "unk": ""
  };
  osahavainnot = [];
  taysiHavainto = {};
};

const specialTrimmer = (line) => {
  return line.trim().toLowerCase();
};

const checkBracketsFirstPass = (line) => {
  const bracketsErr = new Error("Incorrect brackets");
  let leftGuy = false;
  for (let i = 0; i < line.length; i++) {
    if (line[Number(i)] === "(") {
      if (leftGuy) throw bracketsErr;
      else leftGuy = true;
    } else if (line[Number(i)] === ")") {
      if (leftGuy) leftGuy = false;
      else throw bracketsErr;
    }
  }
  if (leftGuy) throw bracketsErr;
};

const emptyObservation = (fullObservation) => {
  for (const subobs of fullObservation.osahavainnot) {
    for (const field in subobs) {
      if (subobs[String(field)]) return false;
    }
  }
  return true;
};

/**
 * Wraps all of the required functions together
 * in order to parse one single line.
 * @param {string} line
 */
export const parse = (line) => {
  const lineOfText = specialTrimmer(line);
  checkBracketsFirstPass(lineOfText);
  for (let i = 0; i < lineOfText.length; i++) {
    giveMeABucket(lineOfText[Number(i)], lineOfText, i);
  }
  constructTaysiHavainto();
  const fullObservation = getObservation();
  if (emptyObservation(fullObservation)) {
    throw new Error("Empty observation");
  }
  return fullObservation;
};

export default parse;
