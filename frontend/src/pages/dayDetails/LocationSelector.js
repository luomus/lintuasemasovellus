import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect } from "react";
import { getObservationLocations } from "../../services";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const LocationSelector = (props) => {

  const { stationId, ...state } = props;

  const locationSet = state.setLocations;

  useEffect(() => {
    getObservationLocations(stationId)
      .then((data) => {
        locationSet(data);
      })
      .catch(() => console.error("Problem in station location list"));
  }, [stationId, locationSet]);

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
          state.locations.map((location, i) =>
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
  locationId: PropTypes.string.isRequired,
  setLocationId: PropTypes.func.isRequired
};

export default LocationSelector;
