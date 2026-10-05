import axios from "axios";

export const getObservations = async () => {
  const res = await axios.get("/api/getObservations");
  return res.data;
};

export const getObservationsByObsPeriod = async (obsPeriodId) => {
  const res = await axios.get(`/api/getObservations/${obsPeriodId}`);
  return res.data;
};

export const deleteObservations = async (shorthand_id) => {
  return await axios.delete("/api/deleteObservations", { data: shorthand_id });
};

export const deleteObservationperiod = async (obsperiod_id) => {
  return await axios.delete("/api/deleteObservationperiod", { data: obsperiod_id });
};

export const deleteObservationperiods = async (idsToRemove) => {
  return await axios.post("/api/deleteObservationperiods", idsToRemove );
};

export const updateLocalObservation = async (date, observatory, species, shorthand, observation, gau) => {
  return await axios.post("/api/updateLocalObservation", { "date": date, "observatory": observatory, "species": species, "shorthand": shorthand, "observation": observation, "gau": gau });
};

export const updateScatterObservation = async (date, observatory, species, shorthand, observation) => {
  return await axios.post("/api/updateScatterObservation", { "date": date, "observatory": observatory, "species": species, "shorthand": shorthand, "observation": observation });
};
