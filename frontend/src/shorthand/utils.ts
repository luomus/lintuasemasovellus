import type { TFunction } from "i18next";

export const translateShorthandError = (t: TFunction, message: string) => {
  let msg: string;
  if (message.includes("unknownTerm")) {
    msg = t("unknownTerm", { term: (message.split(/:(.+)/)[1]) });
  } else {
    msg = t(message);
  }
  return msg;
};

export const isTime = (row: string) => {
  return row.match(/^(?:[01]?[0-9]|2[0-3])[:.][0-5][0-9]$/);
};

export const parseTime = (timeString: string) => {
  const [hours = "", minutes = ""] = timeString.replace(".", ":").split(":");
  return `${hours.padStart(2, "0")}:${minutes}`;
};

export const timeStringToFloat = (timeString: string) => {
  const hoursMinutes = timeString.split(/[.:]/);
  const hours = parseInt(hoursMinutes[0], 10);
  const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
  return hours + minutes / 60;
};
