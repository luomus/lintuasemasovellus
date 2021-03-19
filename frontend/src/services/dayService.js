import axios from "axios";

export const getDays = async () => {
  const days = await axios.get("/api/listDays");
  return days.data;
};

export const postDay = async (day) => {
  return await axios.post("/api/addDay", day);
};

export const postCatches = async (catches) => {
  return await axios.post("/api/addCatches", catches);
};

export const editComment = async (dayId, comment) => {
  return await axios.post(`/api/editComment/${dayId}/${comment}`);
};

export const editObservers = async (dayId, observers) => {
  return await axios.post(`/api/editObservers/${dayId}/${observers}`);
};

export const editActions = async (dayId, actions) => {
  console.log("services dayid:", dayId, actions);
  return await axios.post(`/api/editActions/${dayId}/${actions}`);
};

export const getCatches = async (dayId) => {
  console.log("Getin DayID: ", dayId);
  const catches=await axios.get(`/api/getCatchDetails/${dayId}`);
  console.log("Get result", catches.data);
  return catches.data;
  //return await axios.get(`/api/getCatchDetails/${dayId}`);
};


export const getLocationsAndTypes = async (observatory) => {
  const locationsTypes = await axios.get(`/api/getLocationsAndTypes/${observatory}`);
  return locationsTypes.data;
};

export const searchDayInfo = async (date, observatory) => {
  const day = await axios.get(`/api/searchDayInfo/${date}/${observatory}`);
  return day.data;
};

export const getLatestDays = async (observatory) => {
  const days = await axios.get(`/api/getLatestDays/${observatory}`);
  return days.data;
};

export const getSummary = async (dayId) => {
  const summary = await axios.get(`/api/getObservationSummary/${dayId}`);
  return summary.data;
};

export const getShorthandText = async (dayId, type, location) => {
  const shorthand = await axios.get(`/api/getShorthandText/${dayId}/${type}/${location}`);
  return shorthand.data;
};

export const getShorthandByObsPeriod = async (obsPeriodId) => {
  const res = await axios.get(`/api/getShorthandByObsPeriod/${obsPeriodId}/`);
  return res.data;
};

export const sendEverything = async (everything) => {
  const res = await axios.post("/api/addEverything", everything);
  return res;
};
