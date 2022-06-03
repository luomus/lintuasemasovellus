import { isNightTime } from "../nocturnalMigration/checkNightTime.js";
import { getSunrise, getSunset } from "../nocturnalMigration/calculateSunsetAndSunrise.js";

describe.skip("is night time tests", () => {

  test("test checkNightTime method if day", () => {
    console.log("is night time: ", isNightTime("Hangon_Lintuasema"));
    expect(isNightTime("Hangon_Lintuasema")).toBe(false);
  });

  test.skip("test checkNightTime method if night", () => {
    expect(isNightTime("Hangon_Lintuasema")).toBe(true);
  });

  test.skip("test checkNightTime method if day", () => {
    expect(isNightTime("Jurmon_Lintuasema")).toBe(false);
  });

  test.skip("test checkNightTime method if night", () => {
    expect(isNightTime("Jurmon_Lintuasema")).toBe(true);
  });

});

describe("calculate sunset/sunrise tests", () => {

  test("test getting sunrise from hanko", () => {
    const date = new Date();
    const hankoLatitude = "59.832394";
    const hankoLongitude = "22.970695";
    console.log("Get sunrise hanko: ", getSunrise(hankoLatitude, hankoLongitude, date));
  });

  test("test getting sunset from hanko", () => {
    const date = new Date();
    const hankoLatitude = "59.832394";
    const hankoLongitude = "22.970695";
    console.log("Get sunset hanko: ", getSunset(hankoLatitude, hankoLongitude, date));
  });

});
