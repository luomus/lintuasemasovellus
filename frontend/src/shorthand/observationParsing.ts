import { Observation, FullObservation } from "./models";
import { getParsedObservationTerms, ObservationTermParserResult, ParsedAge, ParsedSex } from "./observationTermParsing";

interface ParsedCount {
    count: number;
    age: ParsedAge;
    sex: ParsedSex;
}

const sexAndAgeToObservationCountKey: Record<ParsedSex, Record<ParsedAge, keyof Omit<Observation, "direction"|"bypassSide"|"notes">>> = {
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

export const parseLine = (text: string, speciesCodeMap: Map<string, string>): FullObservation => {
  const speciesAndRestMatch = text.trim().match(/^(\S+)(?:\s(.*)|$)/);
  if (!speciesAndRestMatch) {
    throw new Error("missingSpaceAfterSpecies");
  }
  const [species, rest] = speciesAndRestMatch.slice(1);
  if (!speciesCodeMap.has(species.toUpperCase())) {
    throw new Error("unknownSpeciesError");
  }

  return {
    species: speciesCodeMap.get(species.toUpperCase())!,
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
    result[sexAndAgeToObservationCountKey[val.sex][val.age]] = val.count;
  });

  return result;
};
