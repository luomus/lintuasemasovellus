import birds from "./birds.json";
import defaultBirds from "./defaultBirds.json";

const directions = new Map([
  ["N", "0"],
  ["NNE", "22,5"],
  ["NE", "45"],
  ["ENE", "67,5"],
  ["E", "90"],
  ["ESE", "112,5"],
  ["SE", "135"],
  ["SSE", "157,5"],
  ["S", "180"],
  ["SSW", "202,5"],
  ["SW", "225"],
  ["WSW", "247,5"],
  ["W", "270"],
  ["WNW", "292,5"],
  ["NW", "315"],
  ["NNW", "337,5"],
  ["", ""]
]);

const bypass = new Map([
  ["----", "-4"],
  ["---", "-3"],
  ["--", "-2"],
  ["-", "-1"],
  ["+-", "0"],
  ["+", "1"],
  ["++", "2"],
  ["+++", "3"],
  ["++++", "4"],
  ["", ""]
]);

const inverseDirections = new Map(Array.from(directions, d => d.reverse()));

const inverseBypass = new Map(Array.from(bypass, b => b.reverse()));

const birdMap = new Map(Object.entries(birds));

const uniqueBirds = [...new Set(Object.values(birds).map(bird => bird.value))];

const timeRegex = new RegExp(/^(([01]?[0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

export default {
  directions,
  bypass,
  birdMap,
  timeRegex,
  inverseDirections,
  inverseBypass,
};

export {
  uniqueBirds,
  defaultBirds
};