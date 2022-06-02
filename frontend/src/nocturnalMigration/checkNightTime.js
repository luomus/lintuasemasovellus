import { getHankoSunset, getHankoSunrise, getJurmoSunrise, getJurmoSunset } from "../../src/services";

const isNightHanko = async (currentTime) => {
  const hankoSunset = new Date(await getHankoSunset());
  const hankoSunrise = new Date(await getHankoSunrise());

  if (currentTime >= hankoSunset && currentTime < hankoSunrise) {
    return true;
  }
};

const isNightJurmo = async (currentTime) => {
  const jurmoSunset = new Date(await getJurmoSunset());
  const jurmoSunrise = new Date(await getJurmoSunrise());
  if (currentTime >= jurmoSunset && currentTime < jurmoSunrise) {
    return true;
  }
};


export const isNightTime = (observatory ) => {

  const currentTime = new Date();
  // let currentTime = new Date("June 2, 2022 03:24:00");
  // console.log("current time: ", currentTime);
  // console.log("observatory: ", observatory);

  if (observatory === "Hangon_Lintuasema" && isNightHanko(currentTime)) {
    return true;
  } else if (observatory ==="Jurmon_Lintuasema" && isNightJurmo(currentTime)) {
    return true;
  } else {
    return false;
  }
};

