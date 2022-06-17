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

export const updateObservation = async (shorthand_id) => {
  return await axios.post("/api/updateObservation", shorthand_id );
};

export const updateLocalObservation = async (date, species, count) => {
  return await axios.post("/api/updateLocalObservation", { "date": date, "species": species, "count": count });
};

export const updateLocalGauObservation = async (date, species, count) => {
  return await axios.post("/api/updateLocalGauObservation", { "date": date, "species": species, "count": count });
};