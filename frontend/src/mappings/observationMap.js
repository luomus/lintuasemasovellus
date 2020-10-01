
const observationNumToStation = new Map([
  [1, "Hangon Lintuasema"],
  [2, "Jurmon Lintuasema"]
]);


export const getStation = (numString) => {
  return observationNumToStation.get(numString);
};
