import axios from "axios";

export const getDays = async () => {
  const days = await axios.get("/api/listDays");
  return days.data;
};

export const postDay = async (day) => {
  return await axios.post("/api/addDay", day);
};
