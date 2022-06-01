import { checkNightTime } from "../nocturnalMigration/checkNightTime.js";

describe.skip("night time observation tests", () => {

  test("test checkNightTime method", () => {
    console.log(checkNightTime());
    expect(checkNightTime()).toBe(false);
  });

});
