import axios from "axios";
import { login } from "../constants";

export const getAuth = async () => {
  const authJson = await axios.get(`${login}`);
  return authJson;
};
