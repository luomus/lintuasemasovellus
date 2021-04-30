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