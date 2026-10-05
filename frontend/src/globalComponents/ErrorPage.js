import React from "react";
import { makeStyles } from "@mui/styles";
import {
  Paper,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router-dom";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  errorPaper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 60px 10px",
  },
});

export const ErrorPage = ({ message }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Paper className={classes.errorPaper}>
        <Typography variant="h6" color="error">
          {t("unexpectedError")}
        </Typography>
        { message ? (
          <Typography variant="body1" color="text.secondary">
            {t("errorMessage")}: {message}
          </Typography>
        ) : null }
      </Paper>
    </div>
  );
};

export const RouterErrorPage = () => {
  const error = useRouteError();

  return (
    <ErrorPage message={error.message} />
  );
};

ErrorPage.propTypes = {
  message: PropTypes.string
};


