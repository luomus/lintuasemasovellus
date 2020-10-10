import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getObservationLocations } from "../../services";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const LocationSelector = ({ stationId, locationId, setLocationId }) => {

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getObservationLocations(stationId)
      .then((data) => {
        setLocations(data);
      })
      .catch(() => console.error("Problem in station location list"));
  }, [stationId]);

  const { t } = useTranslation();

  console.log(locations);

  if (!locations.length) return null;
  return (
    <FormControl>
      <InputLabel id="Sijainti">{t("location")} *</InputLabel>
      <Select required
        labelId="location-select"
        id="location"
        value={locationId}
        onChange={(event) => setLocationId(String(event.target.value))}
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
  locationId: PropTypes.string.isRequired,
  setLocationId: PropTypes.func.isRequired
};

export default LocationSelector;
