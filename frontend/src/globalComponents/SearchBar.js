import React, { useState } from "react";
import { IconButton, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const SearchBar = ({ setTextFilter, defaultValue }) => {

  const [value, setValue] = useState(defaultValue);

  const { t } = useTranslation();

  return (
    <>
      <TextField
        rows={1}
        multiline={false}
        id="textFilter"
        fullWidth={true}
        label={t("speciesTextFilter")}
        onKeyDown={(event) => { if (event.key === "Enter") setTextFilter(value); }}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => setTextFilter(value)}
        value={value}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton id="searchButton" size="small" onClick={() => setTextFilter(value)} variant="contained" color="primary">
                <SearchIcon id="searchIcon" />
              </IconButton>
              <IconButton id="clearSearchButton" size="small" onClick={() => { setValue(""); setTextFilter(""); }} variant="contained" color="primary">
                <BackspaceIcon id="backspaceIcon" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

SearchBar.propTypes = {
  defaultValue: PropTypes.string,
  setTextFilter: PropTypes.func
};

export default SearchBar;
