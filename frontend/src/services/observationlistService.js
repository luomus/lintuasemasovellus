import axios from "axios";

export const getObservationlist = async () => {
  const res = await axios.get("/api/havainnointilist");
  return res.data;
};

export const postObservationform = async (form) => {
  await axios.post("/api/havainnointiform", form);
};
