const intitialState =
{
  1:{ notifications:[], errors:[] }
};

const notificationsReducer = (state = intitialState, action) => {
  switch (action.type) {
    case "SET_DAILYACTION_NOTIFICATIONS":
      return { ...state, [action.key]:action.data };
    case "SET_CATCH_NOTIFICATIONS":
      return { ...state, [action.key]:action.data };
    case "RESET":
      return intitialState;
    default:
      return state;
  }
};

export const setNotifications = (validationResult, rowKey=-1) => {
  if (rowKey === "dailyAttachment"){
    return {
      type:"SET_DAILYACTION_NOTIFICATIONS",
      category: "dailyactions",
      key: rowKey,
      data: { notifications: validationResult[0], errors: validationResult[1] }
    };
  }
  if (rowKey !== -1){
    return {
      type:"SET_CATCH_NOTIFICATIONS",
      category: "catches",
      key: rowKey,
      data: { notifications: validationResult[0], errors: validationResult[1] }
    };
  }
};

export const resetNotifications = () => {
  return {
    type:"RESET",
  };
};


export default notificationsReducer;