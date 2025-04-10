import globals from "../globalConstants";
import store from "../store";

export interface Observation {
    adultUnknownCount: number;
    adultFemaleCount: number;
    adultMaleCount: number;
    juvenileUnknownCount: number;
    juvenileFemaleCount: number;
    juvenileMaleCount: number;
    subadultUnknownCount: number;
    subadultFemaleCount: number;
    subadultMaleCount: number;
    chickUnknownCount: number;
    chickFemaleCount: number;
    chickMaleCount: number;
    unknownUnknownCount: number;
    unknownFemaleCount: number;
    unknownMaleCount: number;
    direction: string;
    bypassSide: string;
    notes: string;
}

export interface FullObservation {
    species: string;
    subObservations: Observation[];
}

type ParsedAge = "\""|"'"|"subad"|"pull"|"";

type ParsedSex = "male"|"female"|"unknown";

interface ParsedCount {
    count: number;
    age: ParsedAge;
    sex: ParsedSex;
}

type ObservationTermParserResult = {
    type: "count";
    value: number;
    rawValue: string;
} | {
    type: "age";
    value: ParsedAge;
    rawValue: string;
} | {
    type: "sexDivider"|"direction"|"bypassSide"|"notes"|"unknown";
    value: string;
    rawValue: string;
};

const directions = globals.directions;
const possibleDirections: string[] = Array.from(directions.keys()).filter(val => !!val);
const bypassSides = globals.bypass;
const acceptableBypassSides: string[] = Array.from(bypassSides.keys()).filter(val => !!val);
const acceptableAges: ParsedAge[] = ["\"", "'", "subad", "pull"];

const sexAndAgeToCountKey: Record<ParsedSex, Record<ParsedAge, keyof Omit<Observation, "direction"|"bypassSide"|"notes">>> = {
  "male": {
    "\"": "adultMaleCount",
    "'": "juvenileMaleCount",
    "subad": "subadultMaleCount",
    "pull": "chickMaleCount",
    "": "unknownMaleCount"
  },
  "female": {
    "\"": "adultFemaleCount",
    "'": "juvenileFemaleCount",
    "subad": "subadultFemaleCount",
    "pull": "chickFemaleCount",
    "": "unknownFemaleCount"
  },
  "unknown": {
    "\"": "adultUnknownCount",
    "'": "juvenileUnknownCount",
    "subad": "subadultUnknownCount",
    "pull": "chickUnknownCount",
    "": "unknownUnknownCount"
  }
};

export const parseLine = (text: string): FullObservation => {
  // @ts-expect-error TODO refactor so that the speciesData is given as a parameter or move the species validation elsewhere
  const speciesNameMap: Map<string, { value: string }> = store.getState().speciesData.speciesNameUpperMap;

  const speciesAndRestMatch = text.trim().match(/^(\S+)(?:\s(.*)|$)/);
  if (!speciesAndRestMatch) {
    throw new Error("missingSpaceAfterSpecies");
  }
  const [species, rest] = speciesAndRestMatch.slice(1);
  if (!speciesNameMap.has(species.toUpperCase())) {
    throw new Error("unknownSpeciesError");
  }

  return {
    species: speciesNameMap.get(species.toUpperCase())!.value,
    subObservations: parseObservations(rest || "")
  };
};

export const parseObservations = (text: string): Observation[] => {
  const parts = splitObservationsAndValidateParenthesis(text);
  const hasEmptyObservations = parts.some(part => !part.trim());

  if (parts.length > 1 && hasEmptyObservations) {
    throw new Error("extraCommas");
  }

  return parts.map(part => parseObservation(part));
};

const splitObservationsAndValidateParenthesis = (text: string): string[] => {
  const result: string[] = [];
  let curr = "";
  let parenthesisOpenEncountered = false;

  for (const char of text) {
    if (char === "(") {
      if (parenthesisOpenEncountered) {
        throw new Error("incorrectBrackets");
      }
      parenthesisOpenEncountered = true;
    } else if (char === ")") {
      if (!parenthesisOpenEncountered) {
        throw new Error("incorrectBrackets");
      }
      parenthesisOpenEncountered = false;
    }

    if (char === "," && !parenthesisOpenEncountered) {
      result.push(curr);
      curr = "";
    } else {
      curr += char;
    }
  }

  result.push(curr);

  if (parenthesisOpenEncountered) {
    throw new Error("incorrectBrackets");
  }

  return result;
};

const parseObservation = (text: string): Observation => {
  text = text.trim();

  if (!text) {
    throw new Error("emptyObservation");
  }

  const parsedTerms = getParsedObservationTerms(text);

  return parsedTermsToObservation(parsedTerms);
};

const parsedTermsToObservation = (parsedTerms: ObservationTermParserResult[]): Observation => {
  const parsedCounts: ParsedCount[] = [];
  let direction = "", bypassSide = "", notes = "";

  const parsedTypes: ObservationTermParserResult["type"][] = parsedTerms.map(term => term.type);
  const countRelatedFields: ObservationTermParserResult["type"][] = ["count", "age", "sexDivider"];

  for (let i = 0; i < parsedTerms.length; i++) {
    const { type, value } = parsedTerms[i];

    const previousTypes = parsedTypes.slice(0, i);
    const previousType = previousTypes[previousTypes.length - 1];
    const nextTypes = parsedTypes.slice(i + 1);

    const currentSlashCount = previousTypes.filter(prevType => prevType === "sexDivider").length;
    const nextTypesIncludesCountRelatedField = countRelatedFields.some(t => nextTypes.includes(t));

    switch (type) {
      case "count": {
        if (previousType === "count") {
          throw new Error("spaceBetweenNumbers");
        }
        if (value === 0) {
          throw new Error("emptyObservation");
        }
        const sex = currentSlashCount === 1 ? "female" : "unknown";
        parsedCounts.push({ count: value, age: "", sex });
        break;
      }
      case "age": {
        if (previousType !== "count") {
          if (previousType === "age") {
            throw new Error("observationHasMultipleAges");
          }
          throw new Error("ageNotAfterCount");
        }
        const currentCount = parsedCounts[parsedCounts.length - 1];
        if (parsedCounts.some(count => count.sex === currentCount.sex && count.age === value)) {
          throw new Error("sameAgeMultipleTimes");
        }
        currentCount.age = value;
        break;
      }
      case "sexDivider":
        if (currentSlashCount > 1) {
          throw new Error("extraSlashes");
        }
        if (currentSlashCount === 0) {
          parsedCounts.forEach(count => {
            count.sex = "male";
          });
        }
        break;
      case "direction":
        if (direction) {
          throw new Error("multipleDirections");
        } else if (nextTypesIncludesCountRelatedField) {
          throw new Error("directionBeforeCounts");
        }

        direction = value;
        break;
      case "bypassSide":
        if (bypassSide) {
          throw new Error("multipleBypassSides");
        } else if (nextTypesIncludesCountRelatedField) {
          throw new Error("bypassSideBeforeCounts");
        } else if (nextTypes.includes("direction")) {
          throw new Error("bypassSideBeforeDirection");
        }

        bypassSide = value;
        break;
      case "notes":
        if (notes) {
          throw new Error("multipleNotes");
        } else if (nextTypesIncludesCountRelatedField) {
          throw new Error("notesBeforeCounts");
        } else if (nextTypes.includes("direction")) {
          throw new Error("notesBeforeDirection");
        } else if (nextTypes.includes("bypassSide")) {
          throw new Error("notesBeforeBypassSide");
        }

        notes = value;
        break;
      default:
        throw new Error(`unknownTerm:${value}`);
    }
  }

  if (!parsedCounts.some(count => count.count > 0)) {
    throw new Error("emptyObservation");
  }

  return parsedValuesToObservation(parsedCounts, direction, bypassSide, notes);
};

const getParsedObservationTerms = (text: string): ObservationTermParserResult[] => {
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

    const directionMatch = getStringTermMatch(text, possibleDirections);
    if (directionMatch) {
      return { type: "direction", value: directionMatch, rawValue: directionMatch };
    }

    const bypassSideMatch = getStringTermMatch(text, acceptableBypassSides);
    if (bypassSideMatch) {
      return { type: "bypassSide", value: bypassSideMatch, rawValue: bypassSideMatch };
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

const parsedValuesToObservation = (parsedCounts: ParsedCount[], direction: string, bypassSide: string, notes: string): Observation => {
  const result: Observation = {
    adultUnknownCount: 0,
    adultFemaleCount: 0,
    adultMaleCount: 0,
    juvenileUnknownCount: 0,
    juvenileFemaleCount: 0,
    juvenileMaleCount: 0,
    subadultUnknownCount: 0,
    subadultFemaleCount: 0,
    subadultMaleCount: 0,
    chickUnknownCount: 0,
    chickFemaleCount: 0,
    chickMaleCount: 0,
    unknownUnknownCount: 0,
    unknownFemaleCount: 0,
    unknownMaleCount: 0,
    direction,
    bypassSide,
    notes
  };

  parsedCounts.forEach(val => {
    result[sexAndAgeToCountKey[val.sex][val.age]] = val.count;
  });

  return result;
};
