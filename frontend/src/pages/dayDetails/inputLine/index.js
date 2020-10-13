import { Grid, TextField } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const InputLine = (props) => {

  const { ...state } = props;

  return (
    <>
      <Grid item xs={2}>
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="laji"
          label="laji"
          value={state.species}
          onChange={(event) => state.setSpecies(event.target.value)}
        />
      </Grid>
      <Grid item xs={7}>
        <TextField
          id="shorthand"
          label="pikakirjoitus"
          value={state.shorthand}
          onChange={(event) => state.setShorthand(event.target.value)}
        />
      </Grid>
    </>
  );
};

InputLine.propTypes = {
  index: PropTypes.number.isRequired
};

export default InputLine;
