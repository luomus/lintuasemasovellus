import Parser from "../shorthand/observationParser";


import {
  makeValidLine,
  withValidSubObservation,
  withBypassSideWrong,
  withDirectionWrong,
  speciesData
} from "./testHelpers";
import { setSpecies } from "../reducers/speciesReducer";
import store from "../store";

describe("Test algorithm with all the cases mentioned in the customer's docs", () => {
  beforeAll(() => {
    store.dispatch(setSpecies(speciesData));
  });

  test("Extremely basic test", () => {
    const lineOfText = "sommol 2/W";

    const observation = Parser().parse(lineOfText);
    expect(observation.species).toBe("sommol");
    const { direction, unknownMaleCount, ...rest } = observation.osahavainnot[0];
    expect(direction).toBe("w");
    expect(unknownMaleCount).toBe("2");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("Harder test", () => {
    const lineOfText = "Smol /4 E";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("smol");
    const { direction, unknownFemaleCount, ...rest } = observation.osahavainnot[0];
    expect(direction).toBe("e");
    expect(unknownFemaleCount).toBe("4");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("Third tier, still going", () => {
    const lineOfText = "Smol /4 E (jp)";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("smol");
    const { direction, unknownFemaleCount, notes, ...rest } = observation.osahavainnot[0];
    expect(direction).toBe("e");
    expect(unknownFemaleCount).toBe("4");
    expect(notes).toBe("jp");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("Fourth, god tier", () => {
    const lineOfText = "Sommol 1\"2juv3subad/W";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("sommol");
    const { direction, juvenileMaleCount, adultMaleCount, subadultMaleCount, ...rest }
      = observation.osahavainnot[0];
    expect(direction).toBe("w");
    expect(juvenileMaleCount).toBe("2");
    expect(adultMaleCount).toBe("1");
    expect(subadultMaleCount).toBe("3");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("Fifth, legacy mode", () => {
    const lineOfText = "sommol /1W, 2/E, 3/4w";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("sommol");
    const { direction: direction0, unknownFemaleCount: unknownFemaleCount0, ...rest0 }
      = observation.osahavainnot[0];
    const { direction: direction1, unknownMaleCount: unknownMaleCount1, ...rest1 }
      = observation.osahavainnot[1];
    const { direction: direction2, unknownFemaleCount: unknownFemaleCount2,
      unknownMaleCount: unknownMaleCount2, ...rest2 }
      = observation.osahavainnot[2];

    expect(unknownFemaleCount0).toBe("1");
    expect(direction0).toBe("w");
    expect(unknownMaleCount1).toBe("2");
    expect(direction1).toBe("e");
    expect(unknownMaleCount2).toBe("3");
    expect(unknownFemaleCount2).toBe("4");
    expect(direction2).toBe("w");
    for (const each of Object.values(rest0)) {
      expect(each).toBe("");
    }
    for (const each of Object.values(rest1)) {
      expect(each).toBe("");
    }
    for (const each of Object.values(rest2)) {
      expect(each).toBe("");
    }
  });

  test("Sixth, no more tears", () => {
    const lineOfText = " sommol /1W, 2/E ,3/4w,";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("sommol");
    expect(observation.osahavainnot[0].unknownFemaleCount).toBe("1");
    expect(observation.osahavainnot[0].direction).toBe("w");
    expect(observation.osahavainnot[1].unknownMaleCount).toBe("2");
    expect(observation.osahavainnot[1].direction).toBe("e");
    expect(observation.osahavainnot[2].unknownMaleCount).toBe("3");
    expect(observation.osahavainnot[2].unknownFemaleCount).toBe("4");
    expect(observation.osahavainnot[2].direction).toBe("w");
  });

  test("Seventh son", () => {
    const lineOfText = "sommol /1W 2E";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("numberAfterDirection");
  });

  test("Eightball", () => {
    const lineOfText = "sommol /1/2W";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("sommol");
    expect(observation.osahavainnot[0].unknownFemaleCount).toBe("1");
    expect(observation.osahavainnot[0].direction).toBe("w");
    expect(observation.osahavainnot[0].unknownUnknownCount).toBe("2");
  });

  test("Nine", () => {
    const lineOfText = "sommol 1\"/2'sw";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("sommol");
    expect(observation.osahavainnot[0].adultMaleCount).toBe("1");
    expect(observation.osahavainnot[0].juvenileFemaleCount).toBe("2");
    expect(observation.osahavainnot[0].direction).toBe("sw");
  });

  test("Ten", () => {
    const lineOfText = "grugru 100SW+-";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("grugru");
    expect(observation.osahavainnot[0].unknownUnknownCount).toBe("100");
    expect(observation.osahavainnot[0].direction).toBe("sw");
    expect(observation.osahavainnot[0].bypassSide).toBe("+-");
  });

  test("Eleven", () => {
    const lineOfText = "grugru 100SW-+";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownBypassSide");
  });

  test("Twelve", () => {
    const lineOfText = "grugru\n100-200SW+-";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("bypassSideNotLast");
  });

  test("Thirteen", () => {
    const lineOfText = "grugru\n100SW+-,200 S +++\n, 300 \"W---";

    const observation = Parser().parse(lineOfText);

    expect(observation.species).toBe("grugru");
    const { direction: direction0, unknownUnknownCount: unknownUnknownCount0,
      bypassSide: bypassSide0, ...rest0 }
      = observation.osahavainnot[0];
    const { direction: direction1, unknownUnknownCount: unknownUnknownCount1,
      bypassSide: bypassSide1, ...rest1 }
      = observation.osahavainnot[1];
    const { direction: direction2, adultUnknownCount: adultUnknownCount2,
      bypassSide: bypassSide2, ...rest2 }
      = observation.osahavainnot[2];
    for (const each of Object.values(rest0)) {
      expect(each).toBe("");
    }
    for (const each of Object.values(rest1)) {
      expect(each).toBe("");
    }
    for (const each of Object.values(rest2)) {
      expect(each).toBe("");
    }
    expect(unknownUnknownCount0).toBe("100");
    expect(direction0).toBe("sw");
    expect(bypassSide0).toBe("+-");
    expect(unknownUnknownCount1).toBe("200");
    expect(direction1).toBe("s");
    expect(bypassSide1).toBe("+++");
    expect(adultUnknownCount2).toBe("300");
    expect(direction2).toBe("w");
    expect(bypassSide2).toBe("---");
  });

  test("Fourteen", () => {
    const lineOfText = "grugru 100SW ,,,\n,200S";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("extraCommas");
  });

  test("Fifteen", () => {
    const lineOfText = "Smol /4 E (jp";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("Sixteen", () => {
    const lineOfText = "Smol /4 E jp)";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("Seventeen", () => {
    const lineOfText = "Smol /4 E ((jp))";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("End of the world", () => {
    const lineOfText = "Smol /4 E ((jp)";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("incorrectBrackets");
  });

  test("three bypass sides in a row", () => {
    const lineOfText = "grugru 100SW+-, 200 S +++ , 300 \"W---";

    const result = Parser().parse(lineOfText);
    expect(result.species).toBe("grugru");
    expect(result.osahavainnot[0].unknownUnknownCount).toBe("100");
    expect(result.osahavainnot[1].unknownUnknownCount).toBe("200");
    expect(result.osahavainnot[2].adultUnknownCount).toBe("300");
    expect(result.osahavainnot[0].bypassSide).toBe("+-");
    expect(result.osahavainnot[1].bypassSide).toBe("+++");
    expect(result.osahavainnot[2].bypassSide).toBe("---");
    expect(result.osahavainnot[0].direction).toBe("sw");
    expect(result.osahavainnot[1].direction).toBe("s");
    expect(result.osahavainnot[2].direction).toBe("w");
  });

  test("quite long input", () => {
    const lineOfText = "sommol 1ad2juv3subad4/1ad2juv3subad4/1ad2juv3subad4E--, 1/2 W";
    const result = Parser().parse(lineOfText);
    expect(result.species).toBe("sommol");
    expect(result.osahavainnot[0].adultMaleCount).toBe("1");
    expect(result.osahavainnot[0].juvenileMaleCount).toBe("2");
    expect(result.osahavainnot[0].subadultMaleCount).toBe("3");
    expect(result.osahavainnot[0].adultFemaleCount).toBe("1");
    expect(result.osahavainnot[0].juvenileFemaleCount).toBe("2");
    expect(result.osahavainnot[0].subadultFemaleCount).toBe("3");
    expect(result.osahavainnot[0].adultUnknownCount).toBe("1");
    expect(result.osahavainnot[0].juvenileUnknownCount).toBe("2");
    expect(result.osahavainnot[0].subadultUnknownCount).toBe("3");
    expect(result.osahavainnot[0].bypassSide).toBe("--");
    expect(result.osahavainnot[0].direction).toBe("e");
    const { direction: direction1, unknownMaleCount: unknownMaleCount1,
      unknownFemaleCount: unknownFemaleCount1, ...rest1 } = result.osahavainnot[1];
    expect(unknownMaleCount1).toBe("1");
    expect(unknownFemaleCount1).toBe("2");
    expect(direction1).toBe("w");
    for (const each of Object.values(rest1)) {
      expect(each).toBe("");
    }
  });

  test("wrong age 1", () => {
    const lineOfText = "sommol 2suba ssw";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownAge");

  });

  test("wrong age 2", () => {
    const lineOfText = "sommol 2sub ssw";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownAge");
  });

  test("wrong age 3", () => {
    const lineOfText = "sommol 2aaa ssw";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownAge");
  });

  test("some wrong ages", () => {
    const lineOfText = "sommol 2juv s, 2subad3\"e, 2/3/1a, 1'";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownAge");
  });

  test("wrong direction 1", () => {
    const lineOfText = "sommol 2juv ss";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownDirection");
  });

  test("wrong direction 2", () => {
    const lineOfText = "sommol 2juv sws";

    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownDirection");
  });

  test("not wrong direction", () => {
    const lineOfText = "sommol 2juv ssw";

    expect(() => {
      Parser().parse(lineOfText);
    }).not.toThrow("unknownDirection");
  });

  test("age is separated from direction", () => {
    const lineOfText = "sommol 1subad2juv S";
    const result = Parser().parse(lineOfText);
    const { direction, subadultUnknownCount, juvenileUnknownCount,
      ...rest } = result.osahavainnot[0];
    expect(direction).toBe("s");
    expect(subadultUnknownCount).toBe("1");
    expect(juvenileUnknownCount).toBe("2");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("age is separated from direction tricky version", () => {
    const lineOfText = "sommol 1subad2juvS";
    const result = Parser().parse(lineOfText);
    const { direction, subadultUnknownCount, juvenileUnknownCount,
      ...rest } = result.osahavainnot[0];
    expect(direction).toBe("s");
    expect(subadultUnknownCount).toBe("1");
    expect(juvenileUnknownCount).toBe("2");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("age is separated from direction extra tricky version", () => {
    const lineOfText = "sommol 1s";
    const result = Parser().parse(lineOfText);
    const { direction, unknownUnknownCount,
      ...rest } = result.osahavainnot[0];
    expect(direction).toBe("s");
    expect(unknownUnknownCount).toBe("1");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("age is separated from direction extra special tricky version", () => {
    const lineOfText = "sommol 1su";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownAge");

  });

});


describe("Randomized tests (fuzzing)", () => {

  test("Random battery w/ 1 000 valid strings", () => {
    const parser = Parser();
    for (let i = 0; i < 1000; ++i) {
      const lineOfText = makeValidLine(withValidSubObservation);
      expect(() => {
        parser.parse(lineOfText);
      }).not.toThrow();
      parser.resetAll();
    }
  });

  /*
  * Remove ".skip" to run this test as well. Note that it might take a while to complete.
  */
  test.skip("Random battery w/ 1 000 000 valid strings", () => {
    const parser = Parser();
    for (let i = 0; i < 1000000; ++i) {
      const line = makeValidLine(withValidSubObservation);
      expect(() => {
        parser.parse(line);
      }).not.toThrow();
      parser.resetAll();
    }
  });

  test("Random battery w/ 1 000 wrong bypassSides", () => {
    const parser = Parser();
    for (let i = 0; i < 1000; ++i) {
      const line = makeValidLine(withBypassSideWrong);
      expect(() => {
        parser.parse(line);
      }).toThrow();
      parser.resetAll();
    }
  });

  test("Random battery w/ 1 000 wrong directions", () => {
    const parser = Parser();
    for (let i = 0; i < 1000; ++i) {
      const line = makeValidLine(withDirectionWrong);
      expect(() => {
        parser.parse(line);
      }).toThrow();
      parser.resetAll();
    }
  });

});

describe("Bugfixes", () => {

  test("can't add observation with only direction", () => {
    const lineOfText = "kt s";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction2", () => {
    const lineOfText = "kt e";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction3", () => {
    const lineOfText = "kt sw";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction4", () => {
    const lineOfText = "kt ne";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction5", () => {
    const lineOfText = "kt nw";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction6", () => {
    const lineOfText = "kt se";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("can't add observation with only direction7", () => {
    const lineOfText = "kt sw";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });


  test("can't add observation with 0 birds", () => {
    const lineOfText = "kt 0";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("emptyObservation");
  });

  test("too long bypassSide 1", () => {
    const lineOfText = "anacre 1ad+++++";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownBypassSide");
  });

  test("too long bypassSide 2", () => {
    const lineOfText = "anacre 1ad-----";
    expect(() => {
      Parser().parse(lineOfText);
    }).toThrow("unknownBypassSide");
  });

  test("AYTMAR is found (one with a slash)", () => {
    const line = "AYTMAR 1++";
    expect(() => {
      Parser().parse(line);
    }).not.toThrow();
  });

  test("too many slashes 1", () => {
    const line = "sommol 1juv/3ad/12'/    ++---    ";
    expect(() => {
      Parser().parse(line);
    }).toThrow("extraSlashes");
  });

  test("too many slashes 2", () => {
    const line = "sommol 1juv/3ad/12'////    ++---    ";
    expect(() => {
      Parser().parse(line);
    }).toThrow("extraSlashes");
  });

  test("too many slashes 3", () => {
    const line = "sommol 1juv/3ad/12', 2/3/1/, 2/3/1    ++---    ";
    expect(() => {
      Parser().parse(line);
    }).toThrow("extraSlashes");
  });

  test("too many slashes 4", () => {
    const line = "sommol //1/";
    expect(() => {
      Parser().parse(line);
    }).toThrow("extraSlashes");
  });

  test("empty in-between slashes 1", () => {
    const line = "sommol 1//  +";
    const result = Parser().parse(line);
    const { unknownMaleCount, bypassSide,
      ...rest } = result.osahavainnot[0];
    expect(unknownMaleCount).toBe("1");
    expect(result.species).toBe("sommol");
    expect(bypassSide).toBe("+");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("empty in-between slashes 2", () => {
    const line = "sommol /1/  +";
    const result = Parser().parse(line);
    const { unknownFemaleCount, bypassSide,
      ...rest } = result.osahavainnot[0];
    expect(unknownFemaleCount).toBe("1");
    expect(result.species).toBe("sommol");
    expect(bypassSide).toBe("+");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("empty in-between slashes 3", () => {
    const line = "sommol //1  +";
    const result = Parser().parse(line);
    const { unknownUnknownCount, bypassSide,
      ...rest } = result.osahavainnot[0];
    expect(unknownUnknownCount).toBe("1");
    expect(result.species).toBe("sommol");
    expect(bypassSide).toBe("+");
    for (const each of Object.values(rest)) {
      expect(each).toBe("");
    }
  });

  test("illegal bypassSides 1", () => {
    const line = "sommol 2 ++-";
    expect(() => {
      Parser().parse(line);
    }).toThrow("unknownBypassSide");
  });

  test("illegal bypassSides 2", () => {
    const line = "sommol 2 +++---";
    expect(() => {
      Parser().parse(line);
    }).toThrow("unknownBypassSide");
  });

  test("multiple ages in observation 1", () => {
    const line = "Grugru 2\"adsubad'juv";
    expect(() => {
      Parser().parse(line);
    }).toThrow("observationHasMultipleAges");
  });

  test("multiple ages in observation 2", () => {
    const line = "parmaj 1\"''''''";
    expect(() => {
      Parser().parse(line);
    }).toThrow("observationHasMultipleAges");
  });

  test("empty observation", () => {
    const line = "sommol";
    expect(() => {
      Parser().parse(line);
    }).toThrow("emptyObservation");
  });

  test("empty observation 2", () => {
    const line = "sommol E";
    expect(() => {
      Parser().parse(line);
    }).toThrow("emptyObservation");
  });

  test("observation notes are parsed ok-ish", () => {
    let noteStr = "23, testi, hauki on kala";
    let noteStr2 = "testi 34, jee";
    let line = "sommol 321 (" + noteStr + "), 555 E (" + noteStr2 + ")";
    let result = Parser().parse(line);
    expect(result.species).toBe("sommol");
    expect(result.osahavainnot[0].unknownUnknownCount).toBe("321");
    expect(result.osahavainnot[0].notes).toBe(noteStr);
    expect(result.osahavainnot[1].unknownUnknownCount).toBe("555");
    expect(result.osahavainnot[1].direction).toBe("e");
    expect(result.osahavainnot[1].notes).toBe(noteStr2);
  });

  test("notes can include times", () => {
    let noteStr = "klo 12.30 aamulla";
    let noteStr2 = "12.1.2021 16:70";
    let line = "sommol 1 (" + noteStr + "), 3 (" + noteStr2 + ")";
    let result = Parser().parse(line);
    expect(result.osahavainnot[0].notes).toBe(noteStr);
    expect(result.osahavainnot[1].notes).toBe(noteStr2);
  });
});
