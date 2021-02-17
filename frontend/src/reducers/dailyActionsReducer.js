const initialState= { vakiohavainto:false, gåu:false, rengastusvakio:false, pöllövakio:false,nisäkkäät:false,liitteet: 0 };


const dailyActionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_ACTIONS":
      //console.log("action.data",action.data.changedAction);
      return { ...state,[action.data.changedAction]:action.data.value };
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

export default dailyActionsReducer;