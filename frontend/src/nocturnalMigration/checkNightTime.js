// import { getJurmoSunrise, getJurmoSunset } from "../services";
import { getSunset, getSunrise } from "./calculateSunsetAndSunrise";

const isNightHanko = (currentTime) => {
  console.log("isnighthanko");
  const hankoLatitude = "59.832394";
  const hankoLongitude = "22.970695";
  const hankoSunset = getSunset(hankoLatitude, hankoLongitude, currentTime);
  const hankoSunrise = getSunrise(hankoLatitude,hankoLongitude,currentTime);
  console.log(currentTime >= hankoSunset && currentTime < hankoSunrise);

  console.log("current time: ", currentTime.toString());
  console.log("hanko sunset: ", hankoSunset.toString());
  console.log("hanko sunrise: ", hankoSunrise.toString());


  if (currentTime >= hankoSunset && currentTime < hankoSunrise) {
    console.log("true");
    return true;
  }
};

const isNightJurmo = (currentTime) => {
  console.log("isnightjurmo");
  const jurmoLatitude = "59.8249967";
  const jurmoLongitude = "21.5999976";
  const jurmoSunset = getSunset(jurmoLatitude, jurmoLongitude, currentTime);
  const jurmoSunrise = getSunrise(jurmoLatitude,jurmoLongitude,currentTime);
  console.log(currentTime >= jurmoSunset && currentTime < jurmoSunrise);

  console.log("current time: ", currentTime);
  console.log("jurmo sunset: ", jurmoSunset);
  console.log("jurmo sunrise: ", jurmoSunrise);


  if (currentTime >= jurmoSunset && currentTime < jurmoSunrise) {
    console.log("true");
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

