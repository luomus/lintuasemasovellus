import axios from "axios";

export const getObservationlist = async () => {
  const res = await axios.get("/api/havainnointilist");
  return res.data;
};

export const getObservationsByObsPeriod = async (obsPeriodId) => {
  const res = await axios.get(`/api/getObservations/${obsPeriodId}`);
  return res.data;
};

export const postObservationform = async (form) => {
  return await axios.post("/api/havainnointiform", form);
};

export const postAddObservation = async (form) => {
  return await axios.post("/api/addObservation", form);
};

export const postAddShorthand = async (form) => {
  return await axios.post("/api/addShorthand", form);
};

export const deleteShorthand = async (shorthand_id) => {
  console.log(shorthand_id);
  return await axios.delete("/api/deleteShorthand", { data: shorthand_id });
};

export const deleteObservations = async (shorthand_id) => {
  console.log(shorthand_id);
  return await axios.delete("/api/deleteObservations", { data: shorthand_id });
};

