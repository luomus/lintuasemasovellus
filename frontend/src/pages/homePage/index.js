import React, {
  useEffect,
  useState
} from "react";
import {
  Paper, Grid, Typography,
  Table, TableRow, TableBody
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getLatestDays } from "../../services";
import Notification from "../../globalComponents/Notification";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";
import { StyledTableCell } from "../../globalComponents/common";
import { ObservationForm } from "./observationForm";

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
}
));

export const HomePage = ({ user, userObservatory }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [latestDays, setLatestDays] = useState(null);

  useEffect(() => {
    getLatestDays(userObservatory)
      .then(daysJson => setLatestDays(daysJson));
  }, [userObservatory]);

  const handleSaveSuccess = () => {
    setLatestDays(null);
    getLatestDays(userObservatory)
      .then(daysJson => setLatestDays(daysJson));
  };

  const handleDateClick = (s) => {
    navigate(`/daydetails/${s.day}`);
  };

  return (
    <div>
      <Grid container
        alignItems="flex-start"
      >
        <Grid item xs={9}>
          <Paper className={classes.obsPaper}>
            <ObservationForm user={user} userObservatory={userObservatory} onSaveSuccess={handleSaveSuccess} />
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
                <Table>
                  <TableBody>
                    {
                      latestDays ? latestDays
                        .map((s, i) =>
                          <TableRow id="latestDaysRow" key={i} hover
                            onClick={() => handleDateClick(s)} className={classes.pointerCursor} >
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
                        ) : <LoadingSpinner size="small" />
                    }
                  </TableBody>
                </Table>
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

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  userObservatory: PropTypes.string.isRequired
};
