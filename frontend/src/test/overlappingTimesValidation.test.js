import { getOverlappingTimeRows } from "../shorthand/validation/overlappingTimesValidation";

describe("overlapping times validation", () => {

  test("adding observations with overlapping times", async () => {
    const observationPeriods = [{ startTime: "11:00", endTime: "15:00" }];

    expect(getOverlappingTimeRows("11:00\nkk 88\n15:00", observationPeriods).length).toBeGreaterThan(0);
    expect(getOverlappingTimeRows("10:00\nkk 88\n11:01", observationPeriods).length).toBeGreaterThan(0);
    expect(getOverlappingTimeRows("12:00\nkk 88\n13:00", observationPeriods).length).toBeGreaterThan(0);
    expect(getOverlappingTimeRows("14:00\nkk 88\n16:00", observationPeriods).length).toBeGreaterThan(0);
  });

  test("adding observations with valid times", async () => {
    const observationPeriods = [{ startTime: "11:00", endTime: "15:00" }];

    expect(getOverlappingTimeRows("08:00\nkk 88\n10:00", observationPeriods).length).toBe(0);
    expect(getOverlappingTimeRows("10:00\nkk 88\n11:00", observationPeriods).length).toBe(0);
    expect(getOverlappingTimeRows("15:00\nkk 88\n16:00", observationPeriods).length).toBe(0);
  });

  test("works with times missing a leading zero", async () => {
    const observationPeriods = [{ startTime: "08:00", endTime: "11:00" }];

    expect(getOverlappingTimeRows("9:00\nkk 88\n13:00", observationPeriods).length).toBeGreaterThan(0);
  });

});
