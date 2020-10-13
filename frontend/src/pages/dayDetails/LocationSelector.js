import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const LocationSelector = (props) => {

  const { locations, ...state } = props;

  const { t } = useTranslation();

  console.log(state.locations);

  if (!state.locations.length) return null;
  return (
    <FormControl>
      <InputLabel id="Sijainti">{t("location")} *</InputLabel>
      <Select required
        labelId="location-select"
        id="location"
        value={state.locationId}
        onChange={(event) => state.setLocationId(String(event.target.value))}
      >
        {
          locations.map((location, i) =>
            <MenuItem value={location.id} key={i}>
              {location.name}
            </MenuItem>
          )
        }
      </Select>
    </FormControl>


  );
};

LocationSelector.propTypes = {
  stationId: PropTypes.string.isRequired,
  locations: PropTypes.array.isRequired
};

export default LocationSelector;
