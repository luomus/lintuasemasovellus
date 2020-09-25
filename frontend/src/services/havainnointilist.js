import axios from "axios";

export const getHavainnointilist = async () => {
  await axios.get("/api/havainnointilist");
};

export const postHavainnointiform = async (form) => {
  await axios.post("/api/havainnointiform", form);
};
