const intitialState =
{
  1:{ notifications:[], errors:[] }
};

const notificationsReducer = (state = intitialState, action) => {
  switch (action.type) {
    case "SET_CATCH_NOTIFICATIONS":
      console.log("action.data",action.key, action.data);
      return { ...state, [action.key]:action.data };
    default:
      return state;
  }
};




export const setNotifications = (validationResult, rowKey=-1) => {
  if (rowKey !== -1){
    return {
      type:"SET_CATCH_NOTIFICATIONS",
      category: "catches",
      key: rowKey,
      data: { notifications: validationResult[0], errors: validationResult[1] }
    };
  }
};



export default notificationsReducer;