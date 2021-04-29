const hankoInitialState = { standardObs: false, gåu: false, standardRing: false, owlStandard: false, mammals: false, attachments: "0" };
//used as default state to avoid issues with controlled vs uncontrolled state


const dailyActionsReducer = (state = hankoInitialState, action) => {
  switch (action.type) {
    case "TOGGLE_ACTIONS":
      return { ...state, [action.data.changedAction]: action.data.value };
    case "SET_ACTIONS":
      return action.data.dailyActions;
    default:
      return state;
  }
};


export const toggleDailyActions = (changedAction, value) => {
  return {
    type: "TOGGLE_ACTIONS",
    data: {
      changedAction: changedAction,
      value: value
    }
  };
};


export const setDailyActions = (dailyActions) => {
  //console.log("action", dailyActions);
  return {
    type: "SET_ACTIONS",
    data: {
      dailyActions
    }
  };
};

export const setDefaultActions = (observatory) => {
  if (observatory === "Hangon_Lintuasema") {
    return {
      type: "SET_ACTIONS",
      data: { dailyActions: hankoInitialState }
    };
  } else {
    return {
      type: "SET_ACTIONS",
      data: { dailyActions: { "attachments": 0 } }
    };
  }
};



export default dailyActionsReducer;