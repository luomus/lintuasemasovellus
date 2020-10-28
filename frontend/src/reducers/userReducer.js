import { getCurrentUser } from "../services";

export const initializeCurrentUser = () => {
  return async dispatch => {
    const currentUser = await getCurrentUser();
    console.log("current user:" + currentUser);
    dispatch(setUser(currentUser));
  };
};


// Presume "user" is going to be JSON
export const setUser = (user) => {
  return {
    type: "SET_USER",
    data: {
      user
    }
  };
};

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.data.user;
    default:
      return state;
  }
};

export default userReducer;
