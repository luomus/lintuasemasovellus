
// Buckets:
let firstSpaceOfLineBreakOrSomeSuchEncountered = false;
let lisatietobucketIsOpen = false;
let lajinimi = "";

let lisatieto = "";
let yksilomaara = "";
let ika = "";

let ohituspuoli = "";
let ilmansuunta = "";
let sukupuoliRound = 2;


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
  switch(sukupuoliRound) {
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
      throw new Error("illegal sukupuoliround");
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

const acceptableIka = new Set(["subad", "ad", "juv", "'", "\""]);


const ikaConstructed = () => {
  return acceptableIka.has(ika);
};

export const constructTaysiHavainto = (startKello, endKello) => {
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
  if (ika === "'") {
    ageBucket = "juv";
  } else if (ika === "\"") {
    ageBucket = "ad";
  } else {
    ageBucket = ika;
  }
  ika = "";
};

const acceptableIkaChar = new Set(["j","v","b","d","e","u","s","a"]);
const acceptlableIlmansuuntaChar = new Set(["n","w","e","s"]);

const isNumeric = (string) => {
  // eslint-disable-next-line eqeqeq
  if (typeof string != "string") return false;
  return !isNaN(string) && !isNaN(parseInt(string));
};

const acceptableAroundIlmansuuntaHeuristic = (index, line) => {
  if (index === line.length - 1) return true;
  if (index === 0) return false;
  if (acceptableIkaChar.has(line[index+1])) {
    return line[index+1] === "s" || line[index+1] === "e";
  }
  let i = index+1;
  while (line[Number(i)] === " " && i < line.length) {
    ++i;
  }
  if (line[Number(i)] === ",") return true;
  if (isNumeric(line[Number(i)])) throw new Error("suunnan jälkeen tulee numero");
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
      throw new Error("illegal sukupuoliRound");
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
      throw new Error("illegal sukupuoliRound");
  }
  yksilomaara = "";
  ageBucket = "unk";
};

const isTooManyCommasHeuristic = (index, line) => {
  let i = index+1;
  while (line[Number(i)] === " " && i < line.length) {
    ++i;
  }
  return line[Number(i)] === ",";
};

/**
 * Organize chars to buckets.
 * @param {character} char
 * @param {string} line
 * @param {integer} index
 */
export const giveMeABucket = (char, line, index) => {
  if (ikaConstructed()) {
    setAgeBucket();
    fillSukupuoliBucketsNotSlash();
  }
  switch(char) {
    default:
      if (lajinimiNotSet()) {
        lajinimi += char;
      } else if (lisatietobucketIsOpen) {
        lisatieto += char;
      } else if (((acceptlableIlmansuuntaChar.has(char) && !acceptableIkaChar.has(char))
        || (acceptlableIlmansuuntaChar.has(char) && (char === "s" || char === "e")))
        && acceptableAroundIlmansuuntaHeuristic(index, line)) {
        ilmansuunta += char;
      } else if (acceptableIkaChar.has(char)) {
        ika += char;
      } else {
        throw new Error(`tuntematon merkki: ${char}`);
      }
      break;
    case " ":case "\t":case "\n":
      firstSpaceOfLineBreakOrSomeSuchEncountered = true;
      break;
    case "0":case "1":case "2":
    case "3":case "4":case "5":
    case "6":case "7":case "8":
    case "9":
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      yksilomaara += char;
      break;
    case ".":case ":":
      // ignore (although time should not be on the line)
      break;
    case "(":
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      openLisatietoBucket();
      break;
    case ")":
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      closeLisatietoBucket();
      break;
    case ",":
      //osahavainto
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      if (isTooManyCommasHeuristic(index, line))
        throw new Error("ylimääräisiä pilkkuja");
      constructOsahavainto();
      break;
    case "'":case "\"":
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      ika += char;
      break;
    case "+":case "-":
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      if (index < line.length - 1
          && char === "-" && line[index + 1] === "+") {
        throw new Error("tuntematon ohituspuoli");
      }
      if (index < line.length - 1
          && line[index + 1] !== " "
          && line[index + 1] !== ","
          && line[index + 1] !== "\n"
          && line[index + 1] !== "+"
          && line[index + 1] !== "-") {
        throw new Error("ohituspuolen pitää olla viimeisenä");
      }
      ohituspuoli += char;
      break;
    case "/":
      if (lajinimiNotSet()) {
        throw new Error("lajinimen jälkeen puuttuu välilyönti");
      }
      fillSukupuoliBucketsSlash();
      break;
  }
};

export const getObservation = () => {
  return taysiHavainto;
};

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

export const specialTrimmer = (line) => {
  return line.trim().toLowerCase();
};

export const checkBracketsFirstPass = (line) => {
  const bracketsErr = new Error("sulut väärin");
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

export const parse = (line) => {
  const lineOfText = specialTrimmer(line);
  checkBracketsFirstPass(lineOfText);
  for (let i = 0; i < lineOfText.length; i++) {
    giveMeABucket(lineOfText[Number(i)], lineOfText, i);
  }
  constructTaysiHavainto();
  return getObservation();
};
