import { isNightTime } from "../nocturnalMigration/checkNightTime.js";
import { getSunrise, getSunset } from "../nocturnalMigration/calculateSunsetAndSunrise.js";

describe("is night time tests", () => {

  test("test checkNightTime Hanko method if day", () => {
    const currentTime = new Date("June 3, 2022 15:00");
    console.log("currentTime: ", currentTime);
    expect(isNightTime("Hangon_Lintuasema", currentTime)).toBe(false);
  });

  test("test checkNightTime Hanko method if night", () => {
    const currentTime = new Date("June 3, 2022 03:00:00");
    expect(isNightTime("Hangon_Lintuasema", currentTime)).toBe(true);
  });

  test("test checkNightTime Jurmo method if day", () => {
    const currentTime = new Date("June 3, 2022 15:24:00");
    expect(isNightTime("Jurmon_Lintuasema", currentTime)).toBe(false);
  });

  test("test checkNightTime Jurmo method if night", () => {
    const currentTime = new Date("June 3, 2022 02:30:00");
    expect(isNightTime("Jurmon_Lintuasema", currentTime)).toBe(true);
  });

  test("test checkNightTime Hanko if current time", () => {
    const currentTime = new Date();
    expect(isNightTime("Hangon_Lintuasema", currentTime)).toBe(false);
  });

});

describe("calculate sunset/sunrise tests", () => {

  test("test getting sunrise from hanko", () => {
    const date = new Date();
    const hankoLatitude = "59.832394";
    const hankoLongitude = "22.970695";
    expect(getSunrise(hankoLatitude,hankoLongitude,date)).not.toBeUndefined();
  });

  test("test getting sunset from hanko", () => {
    const date = new Date();
    const hankoLatitude = "59.832394";
    const hankoLongitude = "22.970695";
    expect(getSunset(hankoLatitude,hankoLongitude,date)).not.toBeUndefined();
  });

  test("test getting sunrise from jurmo", () => {
    const date = new Date();
    const jurmoLatitude = "59.8249967";
    const jurmoLongitude = "21.5999976";
    expect(getSunrise(jurmoLatitude,jurmoLongitude,date)).not.toBeUndefined();
  });

  test("test getting sunset from jurmo", () => {
    const date = new Date();
    const jurmoLatitude = "59.8249967";
    const jurmoLongitude = "21.5999976";
    expect(getSunset(jurmoLatitude,jurmoLongitude,date)).not.toBeUndefined();
  });

});
