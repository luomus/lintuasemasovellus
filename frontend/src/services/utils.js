export const dateToDayString = (date) => {
  if (date === null) {
    return null;
  }
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
};

export const dayStringToDate = (day) => {
  if (day === null) {
    return null;
  }
  const parts = day.split(".");
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

export const getEmptyFormData = (day = null) => ({
  day,
  observers: "",
  comment: "",
  dailyActions: {},
  catchRows: [],
  type: "",
  location: "",
  shorthand: ""
});

export const dayInfoToFormData = (day, dayInfo, defaultActions) => {
  return {
    day,
    observers: dayInfo["observers"] || "",
    comment: dayInfo["comment"] || "",
    dailyActions: dayInfo["selectedactions"] ? dayInfo["selectedactions"] : defaultActions,
    catchRows: dayInfo["catches"] ? dayInfo["catches"]: [],
    type: "",
    location: "",
    shorthand: ""
  };
};

export const stringifyDailyActions = (dailyActions) => {
  if ("attachments" in dailyActions) {
    if (dailyActions.attachments === "" || dailyActions.attachments < 0) {
      return JSON.stringify({ ...dailyActions, "attachments": 0 });
    }
  }
  return JSON.stringify(dailyActions);
};

export const getNewCatchRow = (key) => {
  return { key, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0, verkonPituus: 0, alku: "00:00", loppu: "00:00" };
};

export const objectsDiffer = (obj1, obj2, checkOnlyKeys = undefined) => {
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return true;
    }
    return obj1.some((val, idx) => objectsDiffer(val, obj2[idx]));
  }

  let result = false;
  for (const key in obj1) {
    if (checkOnlyKeys && !checkOnlyKeys.includes(key)) {
      continue;
    }

    if (typeof obj1[key] === "object" && obj1[key] !== null) {
      if (objectsDiffer(obj1[key], obj2[key])) {
        result = true;
        break;
      }
    } else if (obj1[key] !== obj2[key]) {
      result = true;
      break;
    }
  }

  return result;
};
