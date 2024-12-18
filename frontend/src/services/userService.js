import axios from "axios";

export const loginUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:5000/loginRedirect"
  : "/loginRedirect";

export const getToken = async () => {
  const tokens = await axios.get("/get/token");
  return tokens;
};

export const getLogout = async () => {
  return await axios.get("/logout");
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