import axios from "axios";

export const getSpecies = async () => {
  const res = await axios.get("/api/getSpecies");
  return res.data;
};
