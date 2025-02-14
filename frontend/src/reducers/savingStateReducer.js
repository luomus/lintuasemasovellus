const defaultState = { savingCount: 0, saving: false, abortController: new AbortController() };

export const saveData = (saveDataFunc, propagateErrors= false) => {
  return async (dispatch, getState) => {
    const signal = getState().savingState.abortController.signal;

    dispatch(increaseSavingCount());

    try {
      await saveDataFunc();
      if (signal.aborted) {
        return;
      }

      dispatch(decreaseSavingCount());
    } catch (e) {
      if (signal.aborted) {
        return;
      }

      dispatch(decreaseSavingCount());

      if (propagateErrors) {
        throw e;
      } else {
        console.log("error: ", e);
        alert("Tallennus epäonnistui!");
      }
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
      state.abortController.abort();
      return { savingCount: 0, saving: false, abortController: new AbortController() };
    default:
      return state;
  }
};

export default savingStateReducer;
