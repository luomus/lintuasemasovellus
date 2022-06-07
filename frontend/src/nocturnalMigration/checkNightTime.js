import { getSunset, getSunrise } from "./calculateSunsetAndSunrise";

const isNightHanko = (currentTime) => {
  const hankoLatitude = "59.832394";
  const hankoLongitude = "22.970695";
  const hankoSunset = getSunset(hankoLatitude, hankoLongitude, currentTime);
  const hankoSunrise = getSunrise(hankoLatitude,hankoLongitude,currentTime);

  if (currentTime >= hankoSunset || currentTime < hankoSunrise) {
    return true;
  }
};

const isNightJurmo = (currentTime) => {
  const jurmoLatitude = "59.8249967";
  const jurmoLongitude = "21.5999976";
  const jurmoSunset = getSunset(jurmoLatitude, jurmoLongitude, currentTime);
  const jurmoSunrise = getSunrise(jurmoLatitude,jurmoLongitude,currentTime);

  if (currentTime >= jurmoSunset || currentTime < jurmoSunrise) {
    return true;
  }
};


export const isNightTime = (observatory, currentTime) => {

  if (observatory === "Hangon_Lintuasema" && isNightHanko(currentTime)) {
    return true;
  } else if (observatory === "Jurmon_Lintuasema" && isNightJurmo(currentTime)) {
    return true;
  } else {
    return false;
  }
};

