import React from "react";
import {
  makeStyles, Grid,
  Paper, Typography, List, ListItem
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { getErrors } from "../../shorthand/validations";

const useStyles = makeStyles(() => ({
  errorPaper: {
    background: "#f5f890",
    padding: "20px 30px",
    marginTop: "20px",
    maxHeight: "8vw",
    overflow: "auto",
  },
  errorHeading: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

const ErrorPaper = ({ codeMirrorHasErrors }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  if (codeMirrorHasErrors) {
    return (
      <Paper className={classes.errorPaper} >
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" className={classes.errorHeading} >
            <WarningIcon fontSize="inherit" />&nbsp;&nbsp;
            {t("checkShorthand")}
          </Typography>
          <List>
            {
              getErrors().map((error, i) =>
                error[1].substring(0, 5) === "Start" ?
                  <ListItem key={i}>
                    {t(error[1], { row: (error[0] + 1) })}
                  </ListItem>
                  : error[1].includes("character") ?
                    <ListItem key={i}>
                      {t("Check row", { row: (error[0] + 1) })} {t("Unknown character")} : {error[1].slice(-1)}
                    </ListItem>
                    : error[1].substring(0, 5) === "Row" ?
                      <ListItem key={i}>
                        {t("Row ")}{t(error[1], { row: (error[0] + 1) })}
                      </ListItem>
                      : error[1].substring(0, 5) === "Check" ?
                        <ListItem key={i}>
                          {t("Check row", { row: (error[0] + 1) })} {t(error[1].split(": ")[1])}
                        </ListItem>
                        : <ListItem key={i}>
                          {t(error[1])}
                        </ListItem>
              )
            }
          </List>
        </Grid>
      </Paper >);
  }
  return null;
};

ErrorPaper.propTypes = {
  codeMirrorHasErrors: PropTypes.bool.isRequired,
};

export default ErrorPaper;