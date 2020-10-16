import { Grid } from "@material-ui/core";
import React from "react";
import InputHeader from "./InputHeader";
import PropTypes from "prop-types";


const InputGrid = (props) => {

  const { stationName, ...state } = props;

  console.log("inputgrid:", state);
  return (
    <Grid container spacing={3} >
      <InputHeader
        xs={12}
        stationName={stationName}
        selectedLinetype={state.observationType}
        setSelectedLinetype={state.setObservationType}
        {...state}
      />
    </Grid>
  );
};

InputGrid.propTypes = {
  stationName: PropTypes.string.isRequired,
};

export default InputGrid;
