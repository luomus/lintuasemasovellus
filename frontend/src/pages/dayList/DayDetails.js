import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";




const useStyles = makeStyles({
  paper: {
    background: "white",
    padding: "20px 30px",
    margin: "0px 0px 50px 0px",
  },
});
const DayDetails = () => {

  const { day } = useParams();

  const classes = useStyles();

  return (
    <div>
      <Paper className={classes.paper}>
        <Typography variant="h5" component="h2" >
          { day }
        </Typography>
        Lorem ipsum.
      </Paper>
    </div>
  );
};

export default DayDetails;
