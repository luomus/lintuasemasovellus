const notificationsReducer = (state = { notifications:[], errors:[] }, action) => {
  switch (action.type) {
    case "SET_NOTIFICATIONS":
      console.log("action.data",action.data);
      return action.data;
    // case "SET_ACTIONS":
    //   return action.data.dailyActions ;
    default:
      return state;
  }
};




export const setNotifications = (notifications, errors) => {
  return {
    type:"SET_NOTIFICATIONS",
    data: { notifications: notifications, errors: errors }
  };

};



export default notificationsReducer;