const intitialState =
{
  dailyactions: {
    0: { notifications: [], errors: [] },
  },
  catches: {
    0: { notifications: [], errors: [] },
  },
  shorthand: {
    0: { notifications: [], errors: [] },
  },
  isNight: false
};

const notificationsReducer = (state = intitialState, action) => {
  switch (action.type) {
    case "SET_NOCTURNAL_NOTIFICATION":
      // console.log("action: ", action);
      return {
        ...state,
        isNight: action.payload
      };
    case "SET_DAILYACTION_NOTIFICATIONS":
      return {
        ...state,
        dailyactions: {
          ...state.dailyactions,
          [action.key]: action.data,
        },
      };
    case "SET_CATCH_NOTIFICATIONS":
      return {
        ...state,
        catches: {
          ...state.catches,
          [action.key]: action.data,
        },
      };
    case "SET_SHORTHAND_NOTIFICATIONS":
      return {
        ...state,
        shorthand: {
          ...state.shorthand,
          [action.key]: action.data,
        },
      };
    case "RESET":
      return intitialState;
    default:
      return state;
  }
};

export const setNocturnalNotification = (value) => {

  return ({
    type: "SET_NOCTURNAL_NOTIFICATION",
    payload: value
  });
};


export const setNotifications = (validationResult, category, rowKey = -1) => {

  if (category === "dailyactions") {
    return {
      type: "SET_DAILYACTION_NOTIFICATIONS",
      key: rowKey,
      data: { notifications: validationResult[0], errors: validationResult[1] }
    };
  }
  if (category === "catches") {
    return {
      type: "SET_CATCH_NOTIFICATIONS",
      key: rowKey,
      data: { notifications: validationResult[0], errors: validationResult[1] }
    };
  }
  if (category === "shorthand") {
    return {
      type: "SET_SHORTHAND_NOTIFICATIONS",
      key: rowKey,
      data: { notifications: validationResult[0], errors: validationResult[1] }
    };
  }
};

export const resetNotifications = () => {
  return {
    type: "RESET",
  };
};


export default notificationsReducer;