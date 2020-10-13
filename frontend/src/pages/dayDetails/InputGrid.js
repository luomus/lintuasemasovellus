import { Grid } from "@material-ui/core";
import React from "react";
import InputHeader from "./InputHeader";
import PropTypes from "prop-types";
import InputLine from "./inputLine";


const InputGrid = (props) => {

  const { stationId, ...state } = props;

  console.log("inputgrid:", state);

  return (
    <Grid container spacing={3} >
      <InputHeader
        xs={12}
        stationId={stationId}
        selectedLinetype={state.selectedLinetype}
        setSelectedLinetype={state.setSelectedLinetype}
        {...state}
      />
      <InputLine {...state} />
    </Grid>
  );
};

InputGrid.propTypes = {
  stationId: PropTypes.string.isRequired,
};

export default InputGrid;
