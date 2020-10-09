import axios from "axios";

export const getObservationStations = async () => {
  const res = await axios.get("/api/getStations");
  return res.data;
};

export const postObservationPeriod = async (form) => {
  return await axios.post("/api/addObservationPeriod", form);
};
