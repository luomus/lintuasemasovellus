const hankoInitialState= { vakiohavainto:false, gåu:false, rengastusvakio:false, pöllövakio:false,nisäkkäät:false,liitteet: 0 };


const dailyActionsReducer = (state = hankoInitialState, action) => {
  switch (action.type) {
    case "TOGGLE_ACTIONS":
      //console.log("action.data",action.data);
      return { ...state,[action.data.changedAction]:action.data.value };
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
      changedAction:changedAction,
      value:value
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
  if (observatory==="Hangon_Lintuasema") {
    return {
      type: "SET_ACTIONS",
      data: { dailyActions: hankoInitialState }
    };
  }
};



export default dailyActionsReducer;