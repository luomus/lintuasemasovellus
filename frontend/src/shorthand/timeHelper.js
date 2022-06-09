import globals from "../globalConstants";

export const isTime = (row) => {
  return String(row).match(globals.timeRegex);
};

export const parseTime = (timeString) => {
  let ret = "";
  for (let i = 0; i < timeString.length; i++) {
    if (timeString[Number(i)] === ".") {
      ret += ":";
    } else {
      ret += timeString[Number(i)];
    }
  }
  return ret;
};

export const parseTimeForComparison = (timeString) => {
  let ret = 0;
  let tens = 1;
  for (let i = timeString.length - 1; i >= 0; i--) {
    if (timeString[Number(i)] !== "." && timeString[Number(i)] !== ":") {
      ret += timeString[Number(i)] * tens;
      tens *= 10;
    }
  }
  return ret;
};

export const parseTimeForNightValidation = (timeString) => {
  let t = timeString;
  let ms = Number(t.split(/[.:]/)[0]) * 60 * 60 * 1000 + Number(t.split(/[.:]/)[1]) * 60 * 1000;
  return ms;
};