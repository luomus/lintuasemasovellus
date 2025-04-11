import {
  makeValidLine,
  withValidSubObservation,
  withBypassSideWrong,
  withDirectionWrong,
  speciesData
} from "./testHelpers";
import { setSpecies } from "../reducers/speciesReducer";
import store from "../store";
import { parseLine } from "../shorthand/observationParsing";

describe("Test algorithm with all the cases mentioned in the customer's docs", () => {
  beforeAll(() => {
    store.dispatch(setSpecies(speciesData));
  });

  test("Extremely basic test", () => {
    const lineOfText = "sommol 2/W";

    const observation = parseLine(lineOfText);
    expect(observation.species).toBe("SOMMOL");
    const { direction, unknownMaleCount, bypassSide, notes, ...rest } = observation.subObservations[0];
    expect(direction).toBe("270");
    expect(unknownMaleCount).toBe(2);
    expect(notes).toBe("");
    expect(bypassSide).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("Harder test", () => {
    const lineOfText = "Smol /4 E";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    const { direction, unknownFemaleCount, bypassSide, notes, ...rest } = observation.subObservations[0];
    expect(direction).toBe("90");
    expect(unknownFemaleCount).toBe(4);
    expect(notes).toBe("");
    expect(bypassSide).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("Third tier, still going", () => {
    const lineOfText = "Smol /4 E (jp)";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    const { direction, unknownFemaleCount, notes, bypassSide, ...rest } = observation.subObservations[0];
    expect(direction).toBe("90");
    expect(unknownFemaleCount).toBe(4);
    expect(notes).toBe("jp");
    expect(bypassSide).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("Fourth, god tier", () => {
    const lineOfText = "Sommol 1\"2'3subad/W";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    const { direction, juvenileMaleCount, adultMaleCount, subadultMaleCount, bypassSide, notes, ...rest }
      = observation.subObservations[0];
    expect(direction).toBe("270");
    expect(juvenileMaleCount).toBe(2);
    expect(adultMaleCount).toBe(1);
    expect(subadultMaleCount).toBe(3);
    expect(bypassSide).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("Fifth, legacy mode", () => {
    const lineOfText = "sommol /1W, 2/E, 3/4w";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    const { direction: direction0, unknownFemaleCount: unknownFemaleCount0, bypassSide: bypassSide0, notes: notes0, ...rest0 }
      = observation.subObservations[0];
    const { direction: direction1, unknownMaleCount: unknownMaleCount1, bypassSide: bypassSide1, notes: notes1, ...rest1 }
      = observation.subObservations[1];
    const { direction: direction2, unknownFemaleCount: unknownFemaleCount2,
      unknownMaleCount: unknownMaleCount2, bypassSide: bypassSide2, notes: notes2, ...rest2 }
      = observation.subObservations[2];

    expect(unknownFemaleCount0).toBe(1);
    expect(direction0).toBe("270");
    expect(bypassSide0).toBe("");
    expect(notes0).toBe("");
    expect(unknownMaleCount1).toBe(2);
    expect(direction1).toBe("90");
    expect(bypassSide1).toBe("");
    expect(notes1).toBe("");
    expect(unknownMaleCount2).toBe(3);
    expect(unknownFemaleCount2).toBe(4);
    expect(direction2).toBe("270");
    expect(bypassSide2).toBe("");
    expect(notes2).toBe("");
    for (const each of Object.values(rest0)) {
      expect(each).toBe(0);
    }
    for (const each of Object.values(rest1)) {
      expect(each).toBe(0);
    }
    for (const each of Object.values(rest2)) {
      expect(each).toBe(0);
    }
  });

  test("Sixth, no more tears", () => {
    const lineOfText = " sommol /1W, 2/E ,3/4w";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    expect(observation.subObservations[0].unknownFemaleCount).toBe(1);
    expect(observation.subObservations[0].direction).toBe("270");
    expect(observation.subObservations[1].unknownMaleCount).toBe(2);
    expect(observation.subObservations[1].direction).toBe("90");
    expect(observation.subObservations[2].unknownMaleCount).toBe(3);
    expect(observation.subObservations[2].unknownFemaleCount).toBe(4);
    expect(observation.subObservations[2].direction).toBe("270");
  });

  test("Seventh son", () => {
    const lineOfText = "sommol /1W 2E";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("directionBeforeCounts");
  });

  test("Eightball", () => {
    const lineOfText = "sommol /1/2W";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    expect(observation.subObservations[0].unknownFemaleCount).toBe(1);
    expect(observation.subObservations[0].direction).toBe("270");
    expect(observation.subObservations[0].unknownUnknownCount).toBe(2);
  });

  test("Nine", () => {
    const lineOfText = "sommol 1\"/2'sw";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("SOMMOL");
    expect(observation.subObservations[0].adultMaleCount).toBe(1);
    expect(observation.subObservations[0].juvenileFemaleCount).toBe(2);
    expect(observation.subObservations[0].direction).toBe("225");
  });

  test("Ten", () => {
    const lineOfText = "grugru 100SW+-";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("GRUGRU");
    expect(observation.subObservations[0].unknownUnknownCount).toBe(100);
    expect(observation.subObservations[0].direction).toBe("225");
    expect(observation.subObservations[0].bypassSide).toBe("0");
  });

  test("Eleven", () => {
    const lineOfText = "grugru 100SW-+";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("multipleBypassSides");
  });

  test("Twelve", () => {
    const lineOfText = "grugru 100-200SW+-";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("bypassSideBeforeCounts");
  });

  test("Thirteen", () => {
    const lineOfText = "grugru 100SW+-,200 S +++ , 300 \"W---";

    const observation = parseLine(lineOfText);

    expect(observation.species).toBe("GRUGRU");
    const { direction: direction0, unknownUnknownCount: unknownUnknownCount0,
      bypassSide: bypassSide0, notes: notes0, ...rest0 }
      = observation.subObservations[0];
    const { direction: direction1, unknownUnknownCount: unknownUnknownCount1,
      bypassSide: bypassSide1, notes: notes1, ...rest1 }
      = observation.subObservations[1];
    const { direction: direction2, adultUnknownCount: adultUnknownCount2,
      bypassSide: bypassSide2, notes: notes2, ...rest2 }
      = observation.subObservations[2];
    for (const each of Object.values(rest0)) {
      expect(each).toBe(0);
    }
    for (const each of Object.values(rest1)) {
      expect(each).toBe(0);
    }
    for (const each of Object.values(rest2)) {
      expect(each).toBe(0);
    }
    expect(unknownUnknownCount0).toBe(100);
    expect(direction0).toBe("225");
    expect(bypassSide0).toBe("0");
    expect(notes0).toBe("");
    expect(unknownUnknownCount1).toBe(200);
    expect(direction1).toBe("180");
    expect(bypassSide1).toBe("3");
    expect(notes1).toBe("");
    expect(adultUnknownCount2).toBe(300);
    expect(direction2).toBe("270");
    expect(bypassSide2).toBe("-3");
    expect(notes2).toBe("");
  });

  test("Fourteen", () => {
    const lineOfText = "grugru 100SW ,,,\n,200S";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("extraCommas");
  });

  test("Fifteen", () => {
    const lineOfText = "Smol /4 E (jp";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("Sixteen", () => {
    const lineOfText = "Smol /4 E jp)";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("Seventeen", () => {
    const lineOfText = "Smol /4 E ((jp))";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("End of the world", () => {
    const lineOfText = "Smol /4 E ((jp)";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("three bypass sides in a row", () => {
    const lineOfText = "grugru 100SW+-, 200 S +++ , 300 \"W---";

    const result = parseLine(lineOfText);
    expect(result.species).toBe("GRUGRU");
    expect(result.subObservations[0].unknownUnknownCount).toBe(100);
    expect(result.subObservations[1].unknownUnknownCount).toBe(200);
    expect(result.subObservations[2].adultUnknownCount).toBe(300);
    expect(result.subObservations[0].bypassSide).toBe("0");
    expect(result.subObservations[1].bypassSide).toBe("3");
    expect(result.subObservations[2].bypassSide).toBe("-3");
    expect(result.subObservations[0].direction).toBe("225");
    expect(result.subObservations[1].direction).toBe("180");
    expect(result.subObservations[2].direction).toBe("270");
  });

  test("quite long input", () => {
    const lineOfText = "sommol 1\"2'3subad4/1\"2'3subad4/1\"2'3subad4E--, 1/2 W";
    const result = parseLine(lineOfText);
    expect(result.species).toBe("SOMMOL");
    expect(result.subObservations[0].adultMaleCount).toBe(1);
    expect(result.subObservations[0].juvenileMaleCount).toBe(2);
    expect(result.subObservations[0].subadultMaleCount).toBe(3);
    expect(result.subObservations[0].adultFemaleCount).toBe(1);
    expect(result.subObservations[0].juvenileFemaleCount).toBe(2);
    expect(result.subObservations[0].subadultFemaleCount).toBe(3);
    expect(result.subObservations[0].adultUnknownCount).toBe(1);
    expect(result.subObservations[0].juvenileUnknownCount).toBe(2);
    expect(result.subObservations[0].subadultUnknownCount).toBe(3);
    expect(result.subObservations[0].bypassSide).toBe("-2");
    expect(result.subObservations[0].direction).toBe("90");
    const { direction: direction1, unknownMaleCount: unknownMaleCount1,
      unknownFemaleCount: unknownFemaleCount1, bypassSide, notes, ...rest1 } = result.subObservations[1];
    expect(unknownMaleCount1).toBe(1);
    expect(unknownFemaleCount1).toBe(2);
    expect(direction1).toBe("270");
    expect(bypassSide).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest1)) {
      expect(each).toBe(0);
    }
  });

  test("wrong age 1", () => {
    const lineOfText = "sommol 2suba ssw";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("unknownTerm:suba");

  });

  test("wrong age 2", () => {
    const lineOfText = "sommol 2sub ssw";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("unknownTerm:sub");
  });

  test("wrong age 3", () => {
    const lineOfText = "sommol 2aaa ssw";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("unknownTerm:aaa");
  });

  test("some wrong ages", () => {
    const lineOfText = "sommol 2' s, 2subad3\"e, 2/3/1a, 1'";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("unknownTerm:a");
  });

  test("wrong direction 1", () => {
    const lineOfText = "sommol 2' ss";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("multipleDirections");
  });

  test("wrong direction 2", () => {
    const lineOfText = "sommol 2' sws";

    expect(() => {
      parseLine(lineOfText);
    }).toThrow("multipleDirections");
  });

  test("not wrong direction", () => {
    const lineOfText = "sommol 2' ssw";

    expect(() => {
      parseLine(lineOfText);
    }).not.toThrow("multipleDirections");
  });

  test("age is separated from direction", () => {
    const lineOfText = "sommol 1subad2' S";
    const result = parseLine(lineOfText);
    const { direction, subadultUnknownCount, juvenileUnknownCount, bypassSide, notes,
      ...rest } = result.subObservations[0];
    expect(direction).toBe("180");
    expect(subadultUnknownCount).toBe(1);
    expect(juvenileUnknownCount).toBe(2);
    expect(bypassSide).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("age is separated from direction tricky version", () => {
    const lineOfText = "sommol 1subad2'S";
    const result = parseLine(lineOfText);
    const { direction, subadultUnknownCount, juvenileUnknownCount, bypassSide, notes,
      ...rest } = result.subObservations[0];
    expect(direction).toBe("180");
    expect(subadultUnknownCount).toBe(1);
    expect(juvenileUnknownCount).toBe(2);
    expect(bypassSide).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("age is separated from direction extra tricky version", () => {
    const lineOfText = "sommol 1s";
    const result = parseLine(lineOfText);
    const { direction, unknownUnknownCount, bypassSide, notes,
      ...rest } = result.subObservations[0];
    expect(direction).toBe("180");
    expect(unknownUnknownCount).toBe(1);
    expect(bypassSide).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("age is separated from direction extra special tricky version", () => {
    const lineOfText = "sommol 1su";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("unknownTerm:su");

  });

});


describe("Randomized tests (fuzzing)", () => {

  test("Random battery w/ 1 000 valid strings", () => {
    for (let i = 0; i < 1000; ++i) {
      const lineOfText = makeValidLine(withValidSubObservation);
      expect(() => {
        parseLine(lineOfText);
      }).not.toThrow();
    }
  });

  /*
  * Remove ".skip" to run this test as well. Note that it might take a while to complete.
  */
  test.skip("Random battery w/ 1 000 000 valid strings", () => {
    for (let i = 0; i < 1000000; ++i) {
      const line = makeValidLine(withValidSubObservation);
      expect(() => {
        parseLine(line);
      }).not.toThrow();
    }
  });

  test("Random battery w/ 1 000 wrong bypassSides", () => {
    for (let i = 0; i < 1000; ++i) {
      const line = makeValidLine(withBypassSideWrong);
      expect(() => {
        parseLine(line);
      }).toThrow();
    }
  });

  test("Random battery w/ 1 000 wrong directions", () => {
    for (let i = 0; i < 1000; ++i) {
      const line = makeValidLine(withDirectionWrong);
      expect(() => {
        parseLine(line);
      }).toThrow();
    }
  });

});

describe("Bugfixes", () => {

  test("can't add observation with only direction", () => {
    const lineOfText = "kt s";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction2", () => {
    const lineOfText = "kt e";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction3", () => {
    const lineOfText = "kt sw";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction4", () => {
    const lineOfText = "kt ne";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction5", () => {
    const lineOfText = "kt nw";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction6", () => {
    const lineOfText = "kt se";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction7", () => {
    const lineOfText = "kt sw";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });


  test("can't add observation with 0 birds", () => {
    const lineOfText = "kt 0";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("too long bypassSide 1", () => {
    const lineOfText = "anacre 1\"+++++";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("multipleBypassSides");
  });

  test("too long bypassSide 2", () => {
    const lineOfText = "anacre 1\"-----";
    expect(() => {
      parseLine(lineOfText);
    }).toThrow("multipleBypassSides");
  });

  test("AYTMAR is found (one with a slash)", () => {
    const line = "AYTMAR 1++";
    expect(() => {
      parseLine(line);
    }).not.toThrow();
  });

  test("too many slashes 1", () => {
    const line = "sommol 1'/3\"/12'/    ++---    ";
    expect(() => {
      parseLine(line);
    }).toThrow("extraSlashes");
  });

  test("too many slashes 2", () => {
    const line = "sommol 1'/3\"/12'////    ++---    ";
    expect(() => {
      parseLine(line);
    }).toThrow("extraSlashes");
  });

  test("too many slashes 3", () => {
    const line = "sommol 1'/3\"/12', 2/3/1/, 2/3/1    ++---    ";
    expect(() => {
      parseLine(line);
    }).toThrow("extraSlashes");
  });

  test("too many slashes 4", () => {
    const line = "sommol //1/";
    expect(() => {
      parseLine(line);
    }).toThrow("extraSlashes");
  });

  test("empty in-between slashes 1", () => {
    const line = "sommol 1//  +";
    const result = parseLine(line);
    const { unknownMaleCount, bypassSide, direction, notes,
      ...rest } = result.subObservations[0];
    expect(unknownMaleCount).toBe(1);
    expect(result.species).toBe("SOMMOL");
    expect(bypassSide).toBe("1");
    expect(direction).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("empty in-between slashes 2", () => {
    const line = "sommol /1/  +";
    const result = parseLine(line);
    const { unknownFemaleCount, bypassSide, direction, notes,
      ...rest } = result.subObservations[0];
    expect(unknownFemaleCount).toBe(1);
    expect(result.species).toBe("SOMMOL");
    expect(bypassSide).toBe("1");
    expect(direction).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("empty in-between slashes 3", () => {
    const line = "sommol //1  +";
    const result = parseLine(line);
    const { unknownUnknownCount, bypassSide, direction, notes,
      ...rest } = result.subObservations[0];
    expect(unknownUnknownCount).toBe(1);
    expect(result.species).toBe("SOMMOL");
    expect(bypassSide).toBe("1");
    expect(direction).toBe("");
    expect(notes).toBe("");
    for (const each of Object.values(rest)) {
      expect(each).toBe(0);
    }
  });

  test("illegal bypassSides 1", () => {
    const line = "sommol 2 ++-";
    expect(() => {
      parseLine(line);
    }).toThrow("multipleBypassSides");
  });

  test("illegal bypassSides 2", () => {
    const line = "sommol 2 +++---";
    expect(() => {
      parseLine(line);
    }).toThrow("multipleBypassSides");
  });

  test("multiple ages in observation 1", () => {
    const line = "Grugru 2\"subad'pull";
    expect(() => {
      parseLine(line);
    }).toThrow("observationHasMultipleAges");
  });

  test("multiple ages in observation 2", () => {
    const line = "parmaj 1\"''''''";
    expect(() => {
      parseLine(line);
    }).toThrow("observationHasMultipleAges");
  });

  test("empty observation", () => {
    const line = "sommol";
    expect(() => {
      parseLine(line);
    }).toThrow("emptyObservation");
  });

  test("empty observation 2", () => {
    const line = "sommol E";
    expect(() => {
      parseLine(line);
    }).toThrow("emptyObservation");
  });

  test("observation notes are parsed ok-ish", () => {
    let noteStr = "23, testi, hauki on kala";
    let noteStr2 = "testi 34, jee";
    let line = "sommol 321 (" + noteStr + "), 555 E (" + noteStr2 + ")";
    let result = parseLine(line);
    expect(result.species).toBe("SOMMOL");
    expect(result.subObservations[0].unknownUnknownCount).toBe(321);
    expect(result.subObservations[0].notes).toBe(noteStr);
    expect(result.subObservations[1].unknownUnknownCount).toBe(555);
    expect(result.subObservations[1].direction).toBe("90");
    expect(result.subObservations[1].notes).toBe(noteStr2);
  });

  test("notes can include times", () => {
    let noteStr = "klo 12.30 aamulla";
    let noteStr2 = "12.1.2021 16:70";
    let line = "sommol 1 (" + noteStr + "), 3 (" + noteStr2 + ")";
    let result = parseLine(line);
    expect(result.subObservations[0].notes).toBe(noteStr);
    expect(result.subObservations[1].notes).toBe(noteStr2);
  });
});
