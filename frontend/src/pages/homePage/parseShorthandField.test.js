import { makeSendDataJson } from "./parseShorthandField";

import fs from "fs";
import path from "path";
import { loopThroughCheckForErrors } from "../../shorthand/validations";

describe("Test parsing", () => {

  test("makeSendData returns correct Json", () => {
    const sendData = makeSendDataJson("18.04.2000", "Jurmon lintuasema", "kommentti", "Heikki Havainnoitsija",
      "Piha", "Vakio", ["9.00", "smol 2 W +++", "12.00"]);
    expect(sendData.observatory).toBe("Jurmon lintuasema");
    expect(sendData.day).toBe("18.04.2000");
    expect(sendData.comment).toBe("kommentti");
    expect(sendData.observers).toBe("Heikki Havainnoitsija");
    expect(sendData.location).toBe("Piha");
    expect(sendData.type).toBe("Vakio");
    const { startTime, endTime, observations } = sendData.obsperiods[0];
    expect(startTime).toBe("9:00");
    expect(endTime).toBe("12:00");
    const { species, bypassSide, direction, unknownUnknownCount, shorthandrow, ...rest } = observations[0];
    expect(species).toBe("smol");
    expect(bypassSide).toBe("+++");
    expect(direction).toBe("w");
    expect(unknownUnknownCount).toBe(2);
    expect(shorthandrow).toBe("smol 2 W +++");
    const {
      adultUnknownCount,
      adultFemaleCount,
      adultMaleCount,
      juvenileUnknownCount,
      juvenileFemaleCount,
      juvenileMaleCount,
      subadultUnknownCount,
      subadultFemaleCount,
      subadultMaleCount,
      unknownFemaleCount,
      unknownMaleCount,
      ...notCounter
    } = rest;
    expect(adultUnknownCount).toBe(0);
    expect(adultFemaleCount).toBe(0);
    expect(adultMaleCount).toBe(0);
    expect(juvenileUnknownCount).toBe(0);
    expect(juvenileFemaleCount).toBe(0);
    expect(juvenileMaleCount).toBe(0);
    expect(subadultFemaleCount).toBe(0);
    expect(subadultUnknownCount).toBe(0);
    expect(subadultMaleCount).toBe(0);
    expect(unknownFemaleCount).toBe(0);
    expect(unknownMaleCount).toBe(0);
    for (const field in notCounter) expect(rest[String(field)]).toBe("");
  });

  test("makeSendData does not have error w/ massive multiline", () => {
    const file = path.join(__dirname, "../../shorthand/", "longShorthandExample.txt");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const text = fs.readFileSync(file, "utf8", "r", (err, data) => data);
    const sanitized = loopThroughCheckForErrors(text);
    expect(() => {
      makeSendDataJson("18.04.2000", "Jurmon lintuasema", "kommentti", "Heikki Havainnoitsija",
        "Piha", "Vakio",
        sanitized
      );
    }).not.toThrow();
  });


});
