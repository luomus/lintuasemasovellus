const DEFAULT_ZENITH = 90.8333;

const MSEC_IN_HOUR = 60 * 60 * 1000;

const getDayOfYear = (date) => {
  return Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / 8.64e7);
};

const sinDeg = (deg) => {
  return Math.sin(deg * 2.0 * Math.PI / 360.0);
};

const acosDeg = (x) => {
  return Math.acos(x) * 360.0 / (2 * Math.PI);
};

const asinDeg = (x) => {
  return Math.asin(x) * 360.0 / (2 * Math.PI);
};

const tanDeg = (deg) => {
  return Math.tan(deg * 2.0 * Math.PI / 360.0);
};

const cosDeg = (deg) => {
  return Math.cos(deg * 2.0 * Math.PI / 360.0);
};


const mod = (a, b) => {
  const result = a % b;
  return result < 0
    ? result + b
    : result;
};


export const calculate = (latitude, longitude, isSunrise, zenith, date) => {
  const dayOfYear = getDayOfYear(date);
  const lngHour = longitude / 15;
  const approxTimeOfEventInDays = isSunrise
    ? dayOfYear + ((6 - lngHour) / 24)
    : dayOfYear + ((18.0 - lngHour) / 24);
  const sunMeanAnomaly = (0.9856 * dayOfYear) - 3.289;
  const sunTrueLongitude = mod(sunMeanAnomaly + (1.916 * sinDeg(sunMeanAnomaly)) + (0.020 * sinDeg(2 * sunMeanAnomaly)) + 282.634, 360);
  const ascension = 0.91764 * tanDeg(sunTrueLongitude);
  let RA = 360 / (2 * Math.PI) * Math.atan(ascension);
  RA = mod(RA, 360);
  const lQuadrant = Math.floor(sunTrueLongitude / 90) * 90;
  const raQuadrant = Math.floor(RA / 90) * 90;
  RA = RA + (lQuadrant - raQuadrant);
  RA /= 15;
  const sinDec = 0.39782 * sinDeg(sunTrueLongitude);
  const cosDec = cosDeg(asinDeg(sinDec));
  const cosH = ((cosDeg(zenith)) - (sinDec * (sinDeg(latitude)))) / (cosDec * (cosDeg(latitude)));
  let H = isSunrise
    ? 360 - acosDeg(cosH)
    : acosDeg(cosH);
  H = H /15;
  const T = H + RA - (0.06571 * approxTimeOfEventInDays) - 6.622;
  const UT = mod(T - (longitude / 15), 24);
  const localT = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return new Date(localT + (UT * MSEC_IN_HOUR) + 3*MSEC_IN_HOUR);
};


export const getSunrise = (latitude,longitude,date) => {
  return calculate(latitude, longitude, true, DEFAULT_ZENITH, date);
};

export const getSunset = (latitude,longitude,date) => {
  return calculate(latitude, longitude, false, DEFAULT_ZENITH, date);
};
