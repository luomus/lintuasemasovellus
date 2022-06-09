import notificationsReducer from "./notificationsReducer";
import deepFreeze from "deep-freeze";

describe("notifcationsReducer", () => {
  test("returns new state with action set nocturnal notifictation", () => {
    const state =  { isNight : false };
    const action = {
      type: "SET_NOCTURNAL_NOTIFICATION",
      payload: true,
    };

    deepFreeze(state);
    const newState = notificationsReducer(state, action);

    expect(newState).toEqual({ ...state, isNight: true });
  });

});
