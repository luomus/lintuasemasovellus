import axios from "axios";

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