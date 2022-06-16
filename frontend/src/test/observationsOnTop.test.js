import { observationsOnTop } from "../shorthand/observationsOnTopValidation";

describe("observations on top tests", () => {

  test("adding two abservations with times on top of each other", async () => {

    const value = "12:00\nkk 88\n13:00";

    observationsOnTop(1, value);

  });

});