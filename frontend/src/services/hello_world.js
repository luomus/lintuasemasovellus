import axios from "axios";
import { baseUrl } from "../constants";

export const getHello = async () => {
  const text = await axios.get(baseUrl);
  return text;
};
