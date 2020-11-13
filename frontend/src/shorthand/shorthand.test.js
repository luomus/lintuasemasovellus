import {
  parse,
  resetAll
} from "./shorthand";

describe("Test algorithm with all the cases mentioned in the customer's docs", () => {

  beforeEach(() => {
    resetAll();
  });

  test("Extremely basic test", () => {
    const lineOfText = "sommol 2/W";

    const observation = parse(lineOfText);
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

    const observation = parse(lineOfText);

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

    const observation = parse(lineOfText);

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

    const observation = parse(lineOfText);

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
    const lineOfText = "sm /1W, 2/E, 3/4w";

    const observation = parse(lineOfText);

    expect(observation.species).toBe("sm");
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
    const lineOfText = " sm /1W, 2/E ,3/4w,";

    const observation = parse(lineOfText);

    expect(observation.species).toBe("sm");
    expect(observation.osahavainnot[0].unknownFemaleCount).toBe("1");
    expect(observation.osahavainnot[0].direction).toBe("w");
    expect(observation.osahavainnot[1].unknownMaleCount).toBe("2");
    expect(observation.osahavainnot[1].direction).toBe("e");
    expect(observation.osahavainnot[2].unknownMaleCount).toBe("3");
    expect(observation.osahavainnot[2].unknownFemaleCount).toBe("4");
    expect(observation.osahavainnot[2].direction).toBe("w");
  });

  test("Seventh son", () => {
    const lineOfText = "sm /1W 2E";

    expect(() => {
      parse(lineOfText);
    }).toThrow("suunnan jälkeen tulee numero");
  });

  test("Eightball", () => {
    const lineOfText = "sm /1/2W";

    const observation = parse(lineOfText);

    expect(observation.species).toBe("sm");
    expect(observation.osahavainnot[0].unknownFemaleCount).toBe("1");
    expect(observation.osahavainnot[0].direction).toBe("w");
    expect(observation.osahavainnot[0].unknownUnknownCount).toBe("2");
  });

  test("Nine", () => {
    const lineOfText = "sommol 1\"/2'sw";

    const observation = parse(lineOfText);

    expect(observation.species).toBe("sommol");
    expect(observation.osahavainnot[0].adultMaleCount).toBe("1");
    expect(observation.osahavainnot[0].juvenileFemaleCount).toBe("2");
    expect(observation.osahavainnot[0].direction).toBe("sw");
  });

  test("Ten", () => {
    const lineOfText = "grugru 100SW+-";

    const observation = parse(lineOfText);

    expect(observation.species).toBe("grugru");
    expect(observation.osahavainnot[0].unknownUnknownCount).toBe("100");
    expect(observation.osahavainnot[0].direction).toBe("sw");
    expect(observation.osahavainnot[0].bypassSide).toBe("+-");
  });

  test("Eleven", () => {
    const lineOfText = "grugru 100SW-+";

    expect(() => {
      parse(lineOfText);
    }).toThrow("tuntematon ohituspuoli");
  });

  test("Twelve", () => {
    const lineOfText = "grugru\n100-200SW+-";

    expect(() => {
      parse(lineOfText);
    }).toThrow("ohituspuolen pitää olla viimeisenä");
  });

  test("Thirteen", () => {
    const lineOfText = "grugru\n100SW+-,200 S +++\n, 300 \"W---";

    const observation = parse(lineOfText);

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
      parse(lineOfText);
    }).toThrow("ylimääräisiä pilkkuja");
  });

  test("Fifteen", () => {
    const lineOfText = "Smol /4 E (jp";

    expect(() => {
      parse(lineOfText);
    }).toThrow("sulut väärin");
  });

  test("Sixteen", () => {
    const lineOfText = "Smol /4 E jp)";

    expect(() => {
      parse(lineOfText);
    }).toThrow("sulut väärin");
  });

  test("Seventeen", () => {
    const lineOfText = "Smol /4 E ((jp))";

    expect(() => {
      parse(lineOfText);
    }).toThrow("sulut väärin");
  });

  test("End of the world", () => {
    const lineOfText = "Smol /4 E ((jp)";

    expect(() => {
      parse(lineOfText);
    }).toThrow("sulut väärin");
  });

  test("three bypass sides in a row", () => {
    const lineOfText = "grugru 100SW+-, 200 S +++ , 300 \"W---";

    const result = parse(lineOfText);
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
    const result = parse(lineOfText);
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
      parse(lineOfText);
    }).toThrow("tuntematon ikä");

  });

  test("wrong age 2", () => {
    const lineOfText = "sommol 2sub ssw";

    expect(() => {
      parse(lineOfText);
    }).toThrow("tuntematon ikä");
  });

  test("wrong age 3", () => {
    const lineOfText = "sommol 2aaa ssw";

    expect(() => {
      parse(lineOfText);
    }).toThrow("tuntematon ikä");
  });

  test("some wrong ages", () => {
    const lineOfText = "sommol 2juv s, 2subad3\"e, 2/3/1a, 1'";

    expect(() => {
      parse(lineOfText);
    }).toThrow("tuntematon ikä");
  });

  test("wrong direction 1", () => {
    const lineOfText = "sommol 2juv ss";

    expect(() => {
      parse(lineOfText);
    }).toThrow("Epäkelpo ilmansuunta");
  });

  test("wrong direction 2", () => {
    const lineOfText = "sommol 2juv sws";

    expect(() => {
      parse(lineOfText);
    }).toThrow("Epäkelpo ilmansuunta");
  });

  test("not wrong direction", () => {
    const lineOfText = "sommol 2juv ssw";

    expect(() => {
      parse(lineOfText);
    }).not.toThrow("Epäkelpo ilmansuunta");
  });

  test("age is separated from direction", () => {
    const lineOfText = "sommol 1subad2juv S";
    const result = parse(lineOfText);
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
    const result = parse(lineOfText);
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
    const result = parse(lineOfText);
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
      parse(lineOfText);
    }).toThrow("tuntematon ikä");

  });

});

