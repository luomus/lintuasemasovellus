import { Button, Grid } from "@material-ui/core";
import React from "react";
import InputHeader from "./InputHeader";
import PropTypes from "prop-types";
import InputLine from "./inputLine";


const InputGrid = (props) => {

  const { stationId, ...state } = props;

  console.log("inputgrid:", state);

  const addInputLine = (type) => {
    state.setInputLines(state.inputLines.concat({
      type,
      state: {
        species: "",
        shorthand: "",
      },
    }));
  };

  return (
    <Grid container spacing={3} >
      <InputHeader
        xs={12}
        stationId={stationId}
        selectedLinetype={state.selectedLinetype}
        setSelectedLinetype={state.setSelectedLinetype}
        {...state}
      />
      {
        // show input lines here:
        state.inputLines.map(({ type }, index) =>
          <InputLine
            type={type}
            index={index}
            key={index}
            {...state}
          />
        )
      }
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          type="button"
          onClick={() => addInputLine(state.selectedLinetype)}>
            +
        </Button>
      </Grid>
    </Grid>
  );
};

InputGrid.propTypes = {
  stationId: PropTypes.string.isRequired,
};

export default InputGrid;
