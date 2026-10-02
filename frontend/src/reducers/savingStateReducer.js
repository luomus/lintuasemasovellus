import i18n from "../i18n";

const defaultState = { savingCount: 0, saving: false };
let currentController = new AbortController();

export const saveData = (saveDataFunc) => {
  return async (dispatch) => {
    const controller = currentController;

    dispatch(increaseSavingCount());

    try {
      await saveDataFunc();
      if (controller.signal.aborted) {
        return;
      }

      dispatch(decreaseSavingCount());
    } catch (e) {
      if (controller.signal.aborted) {
        return;
      }

      dispatch(decreaseSavingCount());

      console.error(e);
      alert(i18n.t("unexpectedError"));

      throw e;
    }
  };
};

export const increaseSavingCount = () => {
  return {
    type: "INCREASE_SAVING_COUNT"
  };
};

export const decreaseSavingCount = () => {
  return {
    type: "DECREASE_SAVING_COUNT"
  };
};

export const resetSavingState = () => {
  return {
    type: "RESET"
  };
};

const savingStateReducer = (state = defaultState, action) => {
  let savingCount = state.savingCount;
  switch (action.type) {
    case "INCREASE_SAVING_COUNT":
      savingCount++;
      return { ...state, savingCount, saving: savingCount > 0 };
    case "DECREASE_SAVING_COUNT":
      savingCount--;
      return { ...state, savingCount, saving: savingCount > 0 };
    case "RESET":
      currentController.abort();
      currentController = new AbortController();

      return { savingCount: 0, saving: false };
    default:
      return state;
  }
};

export default savingStateReducer;
