import { Observation, FullObservation } from "./models";
import { getParsedObservationTerms, ObservationTermParserResult, ParsedAge, ParsedSex } from "./observationTermParsing";

type ObservationTermParserFlockResult = ObservationTermParserResult & {
    type: Exclude<ObservationTermParserResult["type"], "flockDivider">
};

interface ParsedCount {
    count: number;
    age: ParsedAge;
    sex: ParsedSex;
}

interface ParsedObservation {
    counts: ParsedCount[];
    direction: string;
    bypassSide: string;
    notes: string;
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
  text = text.trim();

  if (!text) {
    throw new Error("emptyObservation");
  }

  const parsedTerms = getParsedObservationTerms(text);

  return parsedTermsToObservations(parsedTerms);
};

const parsedTermsToObservations = (parsedTerms: ObservationTermParserResult[]): Observation[] => {
  const observations: Observation[] = [];

  let commonDirection = "";
  if (parsedTerms[0]?.type === "direction") {
    commonDirection = parsedTerms[0].value;
    parsedTerms = parsedTerms.slice(1);
  }

  let flockTerms: ObservationTermParserFlockResult[] = [];
  let prevType: string|undefined = undefined;

  for (let i = 0; i < parsedTerms.length; i += 1) {
    const term = parsedTerms[i];
    if (term.type === "flockDivider") {
      if (i === 0 || prevType === "flockDivider" || i === parsedTerms.length - 1) {
        throw new Error("extraCommas");
      }
      observations.push(parsedFlockTermsToObservation(flockTerms, commonDirection));
      flockTerms = [];
    } else {
      flockTerms.push(term as ObservationTermParserFlockResult);
    }
    prevType = term.type;
  }

  observations.push(parsedFlockTermsToObservation(flockTerms, commonDirection));

  return observations;
};

const parsedFlockTermsToObservation = (parsedTerms: ObservationTermParserFlockResult[], commonDirection = ""): Observation => {
  const parsed: ParsedObservation = { counts: [], direction: commonDirection, bypassSide: "", notes: "" };

  const allTypes: ObservationTermParserFlockResult["type"][] = parsedTerms.map(term => term.type);
  const countRelatedFields: ObservationTermParserFlockResult["type"][] = ["count", "age", "sexDivider"];

  for (let i = 0; i < parsedTerms.length; i++) {
    const { type, value } = parsedTerms[i];

    const prevTypes = allTypes.slice(0, i);
    const prevType = prevTypes[prevTypes.length - 1];
    const nextTypes = allTypes.slice(i + 1);

    const currentFlockSlashCount = prevTypes.filter(prevType => prevType === "sexDivider").length;
    const nextTypesIncludesCountRelatedField = countRelatedFields.some(t => nextTypes.includes(t));

    switch (type) {
      case "count": {
        if (prevType === "count") {
          throw new Error("spaceBetweenNumbers");
        }
        if (value === 0) {
          throw new Error("emptyObservation");
        }

        const sex = currentFlockSlashCount === 1 ? "female" : "unknown";
        parsed.counts.push({ count: value, age: "", sex });
        break;
      }
      case "age": {
        if (prevType !== "count") {
          if (prevType === "age") {
            throw new Error("observationHasMultipleAges");
          }
          throw new Error("ageNotAfterCount");
        }
        const currentCount = parsed.counts[parsed.counts.length - 1];
        if (parsed.counts.some(count => count.sex === currentCount.sex && count.age === value)) {
          throw new Error("sameAgeMultipleTimes");
        }

        currentCount.age = value;
        break;
      }
      case "sexDivider":
        if (currentFlockSlashCount > 1) {
          throw new Error("extraSlashes");
        }

        if (currentFlockSlashCount === 0) {
          parsed.counts.forEach(count => {
            count.sex = "male";
          });
        }
        break;
      case "direction":
        if (commonDirection) {
          throw new Error("hasAlreadyCommonDirection");
        } else if (parsed.direction) {
          throw new Error("multipleDirections");
        } else if (nextTypesIncludesCountRelatedField) {
          throw new Error("directionBeforeCounts");
        }

        parsed.direction = value;
        break;
      case "bypassSide":
        if (parsed.bypassSide) {
          throw new Error("multipleBypassSides");
        } else if (nextTypesIncludesCountRelatedField) {
          throw new Error("bypassSideBeforeCounts");
        } else if (nextTypes.includes("direction")) {
          throw new Error("bypassSideBeforeDirection");
        }

        parsed.bypassSide = value;
        break;
      case "notes":
        if (parsed.notes) {
          throw new Error("multipleNotes");
        } else if (nextTypesIncludesCountRelatedField) {
          throw new Error("notesBeforeCounts");
        } else if (nextTypes.includes("direction")) {
          throw new Error("notesBeforeDirection");
        } else if (nextTypes.includes("bypassSide")) {
          throw new Error("notesBeforeBypassSide");
        }

        parsed.notes = value;
        break;
      default:
        throw new Error(`unknownTerm:${value}`);
    }
  }

  if (parsed.counts.length === 0 || !parsed.counts.some(count => count.count > 0)) {
    throw new Error("emptyObservation");
  }

  return parsedObservationToObservation(parsed);
};

const parsedObservationToObservation = (parsedObservation: ParsedObservation): Observation => {
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
    direction: parsedObservation.direction,
    bypassSide: parsedObservation.bypassSide,
    notes: parsedObservation.notes
  };

  parsedObservation.counts.forEach(val => {
    result[sexAndAgeToObservationCountKey[val.sex][val.age]] = val.count;
  });

  return result;
};
