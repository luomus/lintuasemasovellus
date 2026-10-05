import { createSelector } from "reselect";

export const isLoggedInSelector = createSelector(
  [state => state.user],
  (user => !!user.id)
);

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
