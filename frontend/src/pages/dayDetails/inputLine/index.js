import { Grid, TextField } from "@material-ui/core";
import React, { useState } from "react";

const InputLine = () => {

  const [species, setSpecies] = useState("");
  const [shorthand, setShortHand] = useState("");

  return (
    <>
      <Grid item>
        <TextField
          id="laji"
          label="laji"
          value={species}
          onChange={(event) => setSpecies(event.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          id="shorthand"
          label="pikakirjoitus"
          value={shorthand}
          onChange={(event) => setShortHand(event.target.value)}
        />
      </Grid>
    </>
  );
};

export default InputLine;
