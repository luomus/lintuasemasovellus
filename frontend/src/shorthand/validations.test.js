import {
  loopThroughCheckForErrors,
  resetErrors,
  getErrors
} from "./validations";

import {
  withValidSubObservation,
  makeValidMultiline
} from "./testHelpers";

describe ("basic higher order validations", () => {

  beforeEach(() => {
    resetErrors();
  });

  test("no times throws err", () => {
    const text = "sommol 2 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toContain("Havaintorivien täytyy olla aikojen sisällä");
  });

  test("odd amount of times throws err", () => {
    const text = "9.00\nsommol 2 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toContain("Pariton määrä aikoja!");
  });

  test("times in wrong place throws err 1", () => {
    const text = "9.00\n10.00\nsommol 2 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toContain("Havaintorivien täytyy olla aikojen sisällä");
  });

  test("times in wrong place throws err 2", () => {
    const text = "sommol 2 w\n9.00\n10.00";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toContain("Havaintorivien täytyy olla aikojen sisällä");
  });

  test("times in wrong place throws err 3", () => {
    const text = "9.00\nsommol 2 w\n10.00\nanacre 1 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toContain("Havaintorivien täytyy olla aikojen sisällä");
  });

  test("multiline shorthand lines 1", () => {
    const text = "09.00\nsommol\n2\nw\n+++\n10.00";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toEqual([]);
  });

  test("illegal species in multiline", () => {
    const text = "9.00\nsommols 2 W\n10.00";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toEqual(
      ["Tuntematon lajinnimi! (erotithan linnut välilyönnillä, tabilla tai rivinvaihdolla)"]);
  });

  test("two different species in a confusing manner next to each other", () => {
    const text = "9.00\nV K 1/2 W\n12.00";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toEqual(["Error in line 2, V : tyhjä havainto"]);
  });

});

describe("timed tests", () => {

  const timeout = 1000;// millis

  let startTime;

  beforeEach(() => {
    startTime = new Date().getTime();
    resetErrors();
  });

  afterEach(() => {
    const took = new Date().getTime() - startTime;
    if (took > timeout)
      throw new Error(`Timeout! Took: ${took} > ${timeout}`);
  });

  test("Random battery w/ 1 000 valid multilines", () => {
    const multiline = makeValidMultiline(withValidSubObservation, 1000);
    loopThroughCheckForErrors(multiline);
    expect(getErrors()).toEqual([]);//we'll expect no errors
  });

  test("Random battery w/ 10 000 valid multilines", () => {
    const multiline = makeValidMultiline(withValidSubObservation, 10000);
    loopThroughCheckForErrors(multiline);
    expect(getErrors()).toEqual([]);//we'll expect no errors
  });


});
