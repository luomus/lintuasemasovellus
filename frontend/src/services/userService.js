import axios from "axios";
import { authUrl, logoutUrl } from "../constants";

export const getToken = async () => {
  const tokens = await axios.get(authUrl);
  return tokens;
};

export const getLogout = async () => {
  await axios.get(logoutUrl);
};

export const getAuth = async (token, auth_token) => {
  //req = requests.get('https://apitest.laji.fi/v0/person/'
  // + personToken + '?access_token=' + AUTH_TOKEN)
  const auth = await axios.get(`https://apitest.laji.fi/v0/person/${token}/?access_token=${auth_token}`);
  console.log("auth:", auth);
  return auth;
};
