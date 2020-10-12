import { Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import InputHeader from "./InputHeader";
import PropTypes from "prop-types";
import InputLine from "./inputLine";


const InputGrid = ({ stationId }) => {

  const [inputlines, setInputlines] = useState([]);
  const [selectedLinetype, setSelectedLinetype] = useState("");


  const addInputLine = (type) => {
    setInputlines(inputlines.concat(type));
  };

  return (
    <Grid container spacing={3} >
      <InputHeader
        xs={12}
        stationId={stationId}
        selectedLinetype={selectedLinetype}
        setSelectedLinetype={setSelectedLinetype} />
      {
        // show input lines here:
        inputlines.map((strLinetype, index) =>
          <InputLine type={strLinetype} key={index} />
        )
      }
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          type="button"
          onClick={() => addInputLine(selectedLinetype)}>
            +
        </Button>
      </Grid>
    </Grid>
  );
};

InputGrid.propTypes = {
  stationId: PropTypes.string.isRequired
};

export default InputGrid;
