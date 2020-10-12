import { Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const InputLine = (props) => {

  const { index, ...state } = props;

  const setSpecies = (newVal) => {
    state.setInputLines(
      state.inputLines.map((inputLine, i) =>
        i === Number(index)
          ? {
            ...inputLine,
            state: {
              ...inputLine.state,
              species: newVal,
            }
          }
          : inputLine
      )
    );
  };

  const setShortHand = (newVal) => {
    state.setInputLines(
      state.inputLines.map((inputLine, i) =>
        i === Number(index)
          ? {
            ...inputLine,
            state: {
              ...inputLine.state,
              shorthand: newVal,
            }
          }
          : inputLine
      )
    );

  };

  return (
    <>
      <Grid item xs={2}>
        <Typography>
          Tyyppi:
          {
            state.inputLines[Number(index)].type
          }
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="laji"
          label="laji"
          value={state.inputLines[Number(index)].state.species}
          onChange={(event) => setSpecies(event.target.value)}
        />
      </Grid>
      <Grid item xs={7}>
        <TextField
          id="shorthand"
          label="pikakirjoitus"
          value={state.inputLines[Number(index)].state.shorthand}
          onChange={(event) => setShortHand(event.target.value)}
        />
      </Grid>
    </>
  );
};

InputLine.propTypes = {
  index: PropTypes.number.isRequired
};

export default InputLine;
