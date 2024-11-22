import axios from "axios";

export const loginUrl = "/api/loginRedirect";

export const getLogout = async () => {
  return await axios.get("/api/logout");
};

export const getPerson = async () => {
  return await axios.get("/api/getPerson");
};

export const getCurrentUser = async () => {
  const currentUser = await axios.get("/api/getUser");
  return currentUser;
};

export const postUserObservatory = async (observatory) => {
  return await axios.post("/api/setUserObservatory", observatory);
};
