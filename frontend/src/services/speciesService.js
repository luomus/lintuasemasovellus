import axios from "axios";

export const getSpecies = async () => {
  const res = await axios.get("/api/getSpecies");
  return res.data;
};

export const getDefaultSpecies = async (observatory) => {
  const res = await axios.get(`/api/getDefaultSpecies/${observatory}`);
  return res.data;
};
