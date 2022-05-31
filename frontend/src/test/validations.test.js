import {
  loopThroughCheckForErrors,
  resetErrors,
  getErrors
} from "../shorthand/validations";

import { loopThroughCheckForErrors as newLoopThroughCheckForErrors } from "../shorthand/newValidations";

import {
  withValidSubObservation,
  makeValidMultiline
} from "./testHelpers";

import fs from "fs";
import path from "path";

describe("basic higher order validations", () => {

  beforeEach(() => {
    resetErrors();
  });

  test("no times throws err", () => {
    const text = "sommol 2 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()[0][1]).toContain("startTimeMissing");
  });

  test("odd amount of times throws err", () => {
    const text = "9.00\nsommol 2 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()[0][1]).toContain("oddNumberOfTimes");
  });

  test("times in wrong place throws err 1", () => {
    const text = "9.00\n10.00\nsommol 2 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()[0][1]).toContain("startTimeMissing");
  });

  test("times in wrong place throws err 2", () => {
    const text = "sommol 2 w\n9.00\n10.00";
    loopThroughCheckForErrors(text);
    expect(getErrors()[0][1]).toContain("startTimeMissing");
  });

  test("times in wrong place throws err 3", () => {
    const text = "9.00\nsommol 2 w\n10.00\nanacre 1 w";
    loopThroughCheckForErrors(text);
    expect(getErrors()[0][1]).toContain("startTimeMissing");
  });

  test("multiline shorthand lines 1", () => {
    const text = "09.00\nsommol\n2\nw\n+++\n10.00";
    loopThroughCheckForErrors(text);
    expect(getErrors().length).toBeGreaterThan(0);
  });

  test("illegal species in multiline", () => {
    const text = "9.00\nsommols 2 W\n10.00";
    loopThroughCheckForErrors(text);
    expect(getErrors().length).toBeGreaterThan(0);
  });

  test("two different species in a confusing manner next to each other", () => {
    const text = "9.00\nV K 1/2 W\n12.00";
    loopThroughCheckForErrors(text);
    expect(getErrors().length).toBeGreaterThan(0);
  });

  test("two time blocks", () => {
    const text = "9.00\nK 1/2 W\n12.00\n13.00\nV 2 E ++\n13.30";
    loopThroughCheckForErrors(text);
    expect(getErrors()).toEqual([]);//we'll expect no errors
  });

  test("long example shorthand from file", () => {
    const file = path.join(__dirname, "./", "longShorthandExample.txt");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const text = fs.readFileSync(file, "utf8", "r", (err, data) => data);
    loopThroughCheckForErrors(text);
    expect(getErrors()).toEqual([]);//we'll expect no errors
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
