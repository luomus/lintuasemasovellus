import axios from "axios";

export const getObservationlist = async () => {
  await axios.get("/api/havainnointilist");
};

export const postObservationform = async (form) => {
  await axios.post("/api/havainnointiform", form);
};
