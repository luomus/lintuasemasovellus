import { getDefaultActions } from "../reducers/formDataReducer/dailyActionsReducer";

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

export const dayInfoToFormData = (day, dayInfo, observatory, type, location, shorthand) => {
  return {
    baseData: {
      day,
      observers: dayInfo['observers'] || "",
      comment: dayInfo['comment'] || "",
      type: type || "",
      location: location || "",
      shorthand: shorthand || ""
    },
    dailyActions: dayInfo['selectedactions'] ? dayInfo['selectedactions'] : getDefaultActions(observatory),
    catchRows: dayInfo['catches'] ? dayInfo['catches']: []
  }
}

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

    if (obj1[key] !== obj2[key]) {
      result = true;
      break;
    }
  }

  return result;
}
