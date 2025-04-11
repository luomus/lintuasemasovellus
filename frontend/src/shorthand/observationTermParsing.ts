import globals from "../globalConstants";

export type ParsedAge = "\""|"'"|"subad"|"pull"|"";

export type ParsedSex = "male"|"female"|"unknown";

export type ObservationTermParserResult = {
    type: "count";
    value: number;
    rawValue: string;
} | {
    type: "age";
    value: ParsedAge;
    rawValue: string;
} | {
    type: "sexDivider"|"flockDivider"|"direction"|"bypassSide"|"notes"|"unknown";
    value: string;
    rawValue: string;
};

const directions = globals.directions;
const possibleDirections: string[] = Array.from(directions.keys()).filter(val => !!val);
const bypassSides = globals.bypass;
const acceptableBypassSides: string[] = Array.from(bypassSides.keys()).filter(val => !!val);
const acceptableAges: ParsedAge[] = ["\"", "'", "subad", "pull"];

export const getParsedObservationTerms = (text: string): ObservationTermParserResult[] => {
  if (!text.match(/^([^()]*(\([^()]*\))*)*$/)) {
    throw new Error("incorrectBrackets");
  }

  const results: ObservationTermParserResult[] = [];

  const iter = makeObservationTermParserIterator(text);
  let result = iter.next();

  while (!result.done) {
    results.push(result.value);
    result = iter.next();
  }

  return results;
};

const makeObservationTermParserIterator = (text: string): Iterator<ObservationTermParserResult, undefined> => {
  let idx = 0;

  const getStringTermMatch = <T extends string>(text: string, possibleValues: T[]): T|undefined => {
    const matches = possibleValues.filter(val => text.toUpperCase().startsWith(val.toUpperCase()));

    const longestMatch =  matches
      .reduce((acc: T|undefined, s: T): T|undefined => s.length > (acc || "").length ? s : acc, undefined);

    if (!longestMatch) {
      return;
    }

    // if the match contains only alphabets and the next part starts with an alphabet but can't be parsed, then it can be assumed that the parts have an error but belong together (for example the term "subadult" won't be matched with "subad" then)
    if (/^[a-zA-Z]+$/.test(longestMatch)) {
      const nextPart = text.slice(longestMatch.length);
      if (/^[a-zA-Z]/.test(nextPart) && getNextPart(nextPart).type === "unknown") {
        return undefined;
      }
    }

    return longestMatch;
  };

  const getNextPart = (text: string): ObservationTermParserResult => {
    const numberMatch = text.match(/^(\d+).*$/)?.[1];
    if (numberMatch) {
      return { type: "count", value: parseInt(numberMatch, 10), rawValue: numberMatch };
    }

    const ageMatch = getStringTermMatch(text, acceptableAges);
    if (ageMatch) {
      return { type: "age", value: ageMatch, rawValue: ageMatch };
    }

    if (text[0] === "/") {
      return { type: "sexDivider", value: text[0], rawValue: text[0] };
    }

    if (text[0] === ",") {
      return { type: "flockDivider", value: text[0], rawValue: text[0] };
    }

    const directionMatch = getStringTermMatch(text, possibleDirections);
    if (directionMatch) {
      return { type: "direction", value: directions.get(directionMatch)!, rawValue: directionMatch };
    }

    const bypassSideMatch = getStringTermMatch(text, acceptableBypassSides);
    if (bypassSideMatch) {
      return { type: "bypassSide", value: bypassSides.get(bypassSideMatch)!, rawValue: bypassSideMatch };
    }

    const notesMatch = text.match(/^(\(.*?\)).*$/)?.[1];
    if (notesMatch) {
      return { type: "notes", value: notesMatch.substring(1, notesMatch.length - 1), rawValue: notesMatch };
    }

    const unknownMatch = text.match(/^(.*?)(?:[\s\d/"'+\-()]|$)/)![1];
    return { type: "unknown", value: unknownMatch, rawValue: unknownMatch };
  };

  const nextFunc = (): IteratorResult<ObservationTermParserResult, undefined> => {
    if (idx < text.length) {
      const textPart = text.slice(idx);
      if (/^\s/.test(textPart)) {
        idx++;
        return nextFunc();
      }

      const nextValue = getNextPart(textPart);
      idx += nextValue.rawValue.length;
      return { done: false, value: nextValue };
    }

    return { done: true, value: undefined };
  };

  return {
    next() {
      return nextFunc();
    },
  };
};
