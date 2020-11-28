import birds from "./birds.json";


const spaceySymbols = [" ", "\t", "\n"];

const ages = ["'", "\"", "juv", "ad", "subad"];

const directions = ["N", "W", "S", "E", "NE", "NW", "SW", "SE",
  "NNE", "ENE", "ESE", "SSE", "SSW", "WSW", "WNW", "NNW"];


// we don't care about slashes in the objects' keys:
const birdArr = Object.keys(birds)
  .reduce((acc, bird) => {
    bird.includes("/")
      ? acc = acc.concat(bird.split("/"))
      : acc.push(bird);
    return acc;
  },
  []);

const randomIndex = (len) => {
  return Math.floor(Math.random() * len);
};

const getRandomBird = () => {
  return birdArr[Number(randomIndex(birdArr.length))];
};

const getRandomLineBreaks = () => {
  let spaceyStuff = "";
  do spaceyStuff += spaceySymbols[Number(randomIndex(spaceySymbols.length))];
  while(Math.random() > 0.8);
  return spaceyStuff;
};

const getRandomAge = () => {
  return ages[Number(randomIndex(ages.length))];
};

const getRandomAgeOrNot = () => {
  return Math.random() < 0.5 ? "" : getRandomAge();
};

const getRandomLineBreakOrNot = () => {
  return Math.random() < 0.5 ? "" : getRandomLineBreaks();
};

const getNextSlashOrNot = () => {
  return Math.random() < 0.5 ? "" : "/";
};

const getRandomNumber = () => {
  return Math.floor(Math.random() * 10000) + 1;
};

const getCommaOrNot = () => {
  return Math.random() < 0.5 ? "" : ",";
};

const getRandomDirection = () => {
  return directions[Number(randomIndex(directions.length))];
};

const getRandomDirectionOrNot = () => {
  return Math.random() < 0.5 ? "" : getRandomDirection();
};

const getRandomBypassSideOrNot = () => {
  let lineOfText = "";
  let rounds = Math.floor(Math.random() * 4);//0,1,2,3
  for (let i = 0; i < rounds; ++i) {
    lineOfText += "+";
  }
  rounds = Math.floor(Math.random() * 4);//0,1,2,3
  for (let i = 0; i < rounds; ++i) {
    lineOfText += "-";
  }
  return lineOfText;
};

const getRandomBypassSide = () => {
  return getRandomBypassSideOrNot() || (Math.random() < 0.5 ? "+" : "-");
};

const makeValidMeatOfSubobservation = () => {
  let meat = "";
  let nextAge;
  let nextSlash;
  let nextNumber;
  for (let i = 0; ; ++i) {
    nextNumber = getRandomNumber();
    nextAge = getRandomAgeOrNot();
    nextSlash = getNextSlashOrNot();
    meat += nextNumber;
    meat += getRandomLineBreakOrNot();
    meat += nextAge;
    meat += getRandomLineBreakOrNot();
    if (nextSlash && i < 2) meat += nextSlash;
    else break;
  }
  return meat;
};

export const withValidSubObservation = () => {
  let subObservation = makeValidMeatOfSubobservation();
  subObservation += getRandomLineBreakOrNot();
  subObservation += getRandomDirectionOrNot();
  subObservation += getRandomLineBreakOrNot();
  subObservation += getRandomBypassSideOrNot();
  return subObservation;
};

export const withBypassSideWrong = () => {
  let subObservation = "";
  if (Math.random() < 0.5) {
    subObservation += getRandomBypassSide();
    subObservation += getRandomLineBreakOrNot();
    subObservation += makeValidMeatOfSubobservation();
  } else {
    subObservation += makeValidMeatOfSubobservation();
    subObservation += getRandomLineBreakOrNot();
    subObservation += getRandomBypassSide();
  }
  subObservation += getRandomLineBreakOrNot();
  subObservation += getRandomDirection();
  return subObservation;
};

export const withDirectionWrong = () => {
  let subObservation = "";
  if (Math.random() < 0.5) {
    subObservation += getRandomDirection();
    subObservation += getRandomLineBreakOrNot();
    subObservation += makeValidMeatOfSubobservation();
    subObservation += getRandomLineBreakOrNot();
    subObservation += getRandomBypassSide();
  } else {
    subObservation += makeValidMeatOfSubobservation();
    subObservation += getRandomLineBreakOrNot();
    subObservation += getRandomBypassSide();
    subObservation += getRandomLineBreakOrNot();
    subObservation += getRandomDirection();
  }
  return subObservation;
};

const makeValidObservation = (generateSubobservation) => {
  let observation = "";
  let subobservation;
  let nextComma;
  for (let i = 0; ; ++i) {
    subobservation = generateSubobservation();
    nextComma = getCommaOrNot();
    observation += subobservation;
    if (nextComma && i < 2) observation += nextComma;
    else break;
  }
  return observation;
};

export const makeValidLine = (subobservationGenerator) => {
  let lineOfText = "";
  lineOfText += getRandomBird();
  lineOfText += getRandomLineBreaks();
  lineOfText += makeValidObservation(subobservationGenerator);
  return lineOfText;
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 24);
  const mins = Math.floor(Math.random() * 60);
  const result
    = (Math.random < 0.5 ? "0" : "") + hours
    + (Math.random() < 0.5 ? ":" : ".") + (mins < 10 ? "0" + mins : mins);
  return result;
};

const fastIsTime = (line) => {
  return line[1] === "." || line[1] === ":" || line[2] === "." || line[2] === ":";
};

const getTimeOrValidInputLine = (subobservationGenerator) => {
  return Math.random() < 0.17 ? getRandomTime() : makeValidLine(subobservationGenerator);
};

export const makeValidMultiline = (subobservationGenerator, lineCount) => {
  let multilineOfText = [getRandomTime()];
  for (let i = 0; i < lineCount - 2; ++i) {
    const nextLine = getTimeOrValidInputLine(subobservationGenerator);
    multilineOfText.push(nextLine);
    if (fastIsTime(nextLine)) {
      multilineOfText.push(getRandomTime());
      ++i;
    }
  }
  multilineOfText.push(getRandomTime());
  return multilineOfText.join("\n");
};
