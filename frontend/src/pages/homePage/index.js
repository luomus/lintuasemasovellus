import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  Paper, Grid, Typography,
  Table, TableRow, TableBody, Alert
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getLatestDays } from "../../services";
import Notification from "../../globalComponents/Notification";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";
import { StyledTableCell } from "../../globalComponents/common";
import { ObservationForm } from "./observationForm";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles(() => ({
  obsPaper: {
    background: "white",
    padding: "20px 30px",
    margin: "10px 10px 60px 10px",
  },
  infoGrid: {
    padding: "10px",
  },
  infoPaper: {
    background: "white",
    padding: "20px 30px",
    overflow: "auto",
  },
  pointerCursor: {
    cursor: "pointer",
    textDecoration: "underline",
  }
}));

export const HomePage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { observatory } = useContext(AppContext);

  const abortControllerRef = useRef(null);

  const [latestDays, setLatestDays] = useState(null);
  const [latestDaysHasError, setLatestDaysHasError] = useState(false);

  useEffect(() => {
    refreshLatestDays();
  }, [observatory]);

  const refreshLatestDays = async () => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLatestDays(null);
    setLatestDaysHasError(false);

    try {
      const daysJson = await getLatestDays(observatory);
      if (!controller.signal.aborted) {
        setLatestDays(daysJson);
      }
    } catch (e) {
      if (!controller.signal.aborted) {
        console.error(e);
        setLatestDaysHasError(true);
      }
    }
  };

  return (
    <div>
      <Grid container
        alignItems="flex-start"
      >
        <Grid item xs={9}>
          <Paper className={classes.obsPaper}>
            <ObservationForm onSaveSuccess={refreshLatestDays} />
          </Paper>
        </Grid>

        {/* Side panel */}
        <Grid item xs={3}>
          <Grid item xs={12} className={classes.infoGrid}>
            <Paper className={classes.infoPaper}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2" >
                  {t("latestDays")}
                </Typography>
                <br />
                {
                  latestDaysHasError ?
                    <Alert severity="error">{t("latestDaysError")}</Alert> :
                    latestDays ?
                      <Table>
                        <TableBody>
                          {
                            latestDays
                              .map((s, i) =>
                                <TableRow id="latestDaysRow" key={i} hover className={classes.pointerCursor} >
                                  <StyledTableCell component="th" scope="row">
                                    <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                                      {s.day}
                                    </Link>
                                  </StyledTableCell>
                                  <StyledTableCell component="th" scope="row">
                                    <Link style={{ color: "black" }} to={`/daydetails/${s.day}`}>
                                      {t("speciesCount", { count: s.speciesCount })}
                                    </Link>
                                  </StyledTableCell>
                                </TableRow>
                              )
                          }
                        </TableBody>
                      </Table> : <LoadingSpinner size="small" />
                }
              </Grid>
              <br />
              <br />
              <Grid item xs={12} mt={0}>
                <Typography variant="h5" component="h2" >
                  {t("links")}
                  <br />
                  <br />
                </Typography>
                <Link style={{ color: "black" }} to="/listdays"><Typography variant="subtitle1">
                  {t("showDaysPage")}</Typography></Link>
                <Link style={{ color: "black" }} to="/manual"><Typography variant="subtitle1">
                  {t("manualTitle")}</Typography></Link>

              </Grid>
            </Paper>
            <Notification category="shorthand" />
            <Notification category="nocturnalMigration" />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
