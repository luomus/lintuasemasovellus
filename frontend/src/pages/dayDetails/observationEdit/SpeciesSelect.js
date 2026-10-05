import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SpeciesSelect = ({ speciesList, onSelect }) => {
  const { t } = useTranslation();

  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const valueChange = (event, value) => {
    if (value) {
      onSelect(value);
      setValue("");
      setInputValue("");
    }
  };

  const inputValueChange = (event, value) => {
    setInputValue(value);
  };

  return (
    <Autocomplete
      value={value}
      inputValue={inputValue}
      disablePortal
      options={speciesList}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={t("addNewSpecies")} />}
      blurOnSelect={true}
      disableClearable={true}
      autoHighlight={true}
      onChange={valueChange}
      onInputChange={inputValueChange}
    />
  );
};

export default SpeciesSelect;

SpeciesSelect.propTypes = {
  speciesList: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
