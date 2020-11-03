import axios from "axios";

export const getDays = async () => {
  const days = await axios.get("/api/listDays");
  return days.data;
};

export const postDay = async (day) => {
  return await axios.post("/api/addDay", day);
};

export const editComment = async (dayId, comment) => {
  return await axios.post(`/api/editComment/${dayId}/${comment}`);
};

export const editObservers = async (dayId, observers) => {
  return await axios.post(`/api/editObservers/${dayId}/${observers}`);
};

export const getLocationsAndTypes = async (observatory) => {
  const locationsTypes = await axios.get(`/api/getLocationsAndTypes/${observatory}`);
  return locationsTypes.data;
};