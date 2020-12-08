import { makeSendDataJson } from "./parseShorthandField";


describe("Test parsing", () => {

  test("makeSendData returns correct Json", () => {
    const sendData = makeSendDataJson("18.04.2000", "Jurmon lintuasema", "kommentti", "Heikki Havainnoitsija",
      "Piha", "Vakio", ["9.00", "smol 2 W +++", "12.00"]);
    console.log("senddata", sendData);
    expect(sendData.observatory).toBe("Jurmon lintuasema");
    expect(sendData.day).toBe("18.04.2000");
    expect(sendData.comment).toBe("kommentti");
    expect(sendData.observers).toBe("Heikki Havainnoitsija");
    expect(sendData.location).toBe("Piha");
    expect(sendData.type).toBe("Vakio");
    const { startTime, endTime, observations } = sendData.obsperiods[0];
    expect(startTime).toBe("9:00");
    expect(endTime).toBe("12:00");
    console.log("obsercationsnsfdoa:", observations[0]);
    const { species, bypassSide, direction, unknownUnknownCount, shorthandrow, ...rest } = observations[0];
    expect(species).toBe("smol");
    expect(bypassSide).toBe("+++");
    expect(direction).toBe("w");
    expect(unknownUnknownCount).toBe("2");
    expect(shorthandrow).toBe("smol 2 W +++");
    for (const field in rest) expect(rest[String(field)]).toBe("");
  });

});
