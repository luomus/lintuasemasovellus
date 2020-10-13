import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const LocationSelector = (props) => {

  const { stationName, ...state } = props;

  const { t } = useTranslation();

  const stations = useSelector(state => state.stations);
  const locations = stations.find(s => s.observatory === stationName).locations;

  console.log("locations inside selector", locations);

  if (!locations.length) return null;
  return (
    <FormControl>
      <InputLabel id="Sijainti">{t("location")} *</InputLabel>
      <Select required
        labelId="location-select"
        id="location"
        value={state.locationName}
        onChange={(event) => state.setLocationName(String(event.target.value))}
      >
        {
          locations.map((location, i) =>
            <MenuItem value={location} key={i}>
              {location}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  );
};

LocationSelector.propTypes = {
  stationName: PropTypes.string.isRequired
};

export default LocationSelector;
