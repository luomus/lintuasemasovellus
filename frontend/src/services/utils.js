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
  const parts = day.split('.');
  return new Date(parts[2], parts[1] - 1, parts[0]);
};
