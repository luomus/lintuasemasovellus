// action increment
export const setUserObservatory = (observatory) => {
  return {
    type: "SET_OBSERVATORY",
    data: {
        observatory
      }
  };
};

// reducer
const userObservatoryReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_OBSERVATORY":
      return action.data.observatory;
    default:
      return state;
  }
};


export default userObservatoryReducer;
