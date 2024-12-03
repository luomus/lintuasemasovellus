import axios from "axios";

export const getObservationStations = async () => {
  const res = await axios.get("/api/getLocations");
  return res.data;
};

export const getObservationPeriods = async () => {
  const res = await axios.get("/api/getObservationPeriods");
  return res.data;
};

export const getDaysObservationPeriods = async (dayId) => {
  if (!dayId) return [];
  const res = await axios.get(`/api/getDaysObservationPeriods/${dayId}/`);
  return res.data;
};

export const getDaysObservationPeriodCounts = async (dayId) => {
  if (!dayId) return [];
  const res = await axios.get(`/api/getDaysObservationPeriodCounts/${dayId}/`);
  return res.data;
};

export const getDaysObservationPeriodsOther = async (dayId) => {
  const res = await axios.get(`/api/getDaysObservationPeriods/${dayId}/other`);
  return res.data;
};

export const getDaysObservationPeriodsStandard = async (dayId) => {
  const res = await axios.get(`/api/getDaysObservationPeriods/${dayId}/standard`);
  return res.data;
};

export const getObservationLocations = async (stationId) => {
  const res = await axios.get(`/api/getLocations/${stationId}`);
  return res.data;
};
