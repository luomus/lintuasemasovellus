import axios from "axios";

export const getHankoSunrise = async () => {
  const hanko = await axios.get("https://api.sunrise-sunset.org/json?lat=59.832394&lng=22.970695&formatted=0");
  return hanko.data.results.sunrise;
};

export const getHankoSunset = async () => {
  const hanko = await axios.get("https://api.sunrise-sunset.org/json?lat=59.832394&lng=22.970695&formatted=0");
  return hanko.data.results.sunset;
};

export const getJurmoSunrise = async () => {
  const jurmo = await axios.get("https://api.sunrise-sunset.org/json?lat=59.8249967&lng=21.5999976&formatted=0");
  return jurmo.data.results.sunrise;
};

export const getJurmoSunset = async () => {
  const jurmo = await axios.get("https://api.sunrise-sunset.org/json?lat=59.8249967&lng=21.5999976&formatted=0");
  return jurmo.data.results.sunset;
};
