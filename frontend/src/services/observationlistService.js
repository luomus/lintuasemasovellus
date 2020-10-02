import axios from "axios";

export const getObservationlist = async () => {
  const res = await axios.get("/api/havainnointilist");
  return res.data;
};

export const postObservationform = async (form) => {
  return await axios.post("/api/havainnointiform", form);
};
