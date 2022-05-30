import React, { useState, useEffect } from "react";
import { TextField, makeStyles } from "@material-ui/core";
// import { editTotalCount, editLocalCount, editLocalGåuCount, getTotalCount, getLocalCount, getLocalGåuCount } from "../../services";

const useStyles = makeStyles({
  textInput: {
    width: "50px",
  }
});

const LocalInput = () => {

  useEffect(() => {
    // setLocalCount(getLocalCount)
    // setLocalGåuCOunt(getLocalGåuCount)
    // setTotalCount(getLocalTotalCount)
  },[]);

  const [value, setValue] = useState(0);
  // const [totalCount, setTotalCount] = useState(0);
  // const [localCount, setLocalCount] = useState(0);
  // const [localGåuCount, setLocalGåuCount] = useState(0);

  const classes = useStyles();

  const handleInput = (event) => {
    setValue(event.target.value);
    // editTotalCount(totalCount).then(totalCountJson => setTotalCount(totalCountJson.data.totalCount));)
    // editLocalCount(localCount).then(localCountJson => setLocalCount(localCountJson.data.localCount));
    // editLocalGåuCount(localGåuCount).then(localGåuCountJson => setLocalGåuCount(localGåuCountJson.data.localGåuCount));
  };

  return(
    <TextField id="standard-basic" className={classes.textInput}
      variant="standard" type="number" size="small" value={value} onChange={(event) => handleInput(event)} InputProps={{
        inputProps: {
          min: 0
        }
      }}/>
  );
};

export default LocalInput;