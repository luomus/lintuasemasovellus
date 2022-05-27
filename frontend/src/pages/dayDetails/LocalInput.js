import React, { useState } from "react";
import { TextField, makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
  textInput: {
    width: "50px",
  }
});

const LocalInput = () => {

  const [value, setValue] = useState(0);

  const classes = useStyles();

  return(
    <TextField id="standard-basic" className={classes.textInput}
      variant="standard" type="number" size="small" value={value} onChange={(event) => setValue(event.target.value)} InputProps={{
        inputProps: {
          min: 0
        }
      }}/>
  );
};

export default LocalInput;