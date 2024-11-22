import {
  Fade, Modal, Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getObservationsByObsPeriod } from "../../services";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import globals from "../../globalConstants";

const ObservationPeriod = ({ obsPeriod, open, handleClose }) => {

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    },
    paper: {
      backgroundColor: "white",
      height: "85%",
      width: "85%",
      padding: theme.spacing(2, 4, 3),
      overflowY: "scroll",
      overflowX: "hidden",
    },
    root: {
      "& .MuiFormControl-root": {
        width: "70%",
        margin: "1em"
      }
    },
  }));


  const { t } = useTranslation();

  const classes = useStyles();

  const [observations, setObservations] = useState([]);

  useEffect(() => {
    if (obsPeriod.id) {
      getObservationsByObsPeriod(obsPeriod.id)
        .then(observationsJson => setObservations(observationsJson));
    }
  }, [obsPeriod.id]);

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Navigate to="/login" />
    );
  }

  if (!obsPeriod) return <div>{t("observationPeriodNotDefined")}</div>;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2 id="transition-modal-title">{t("observations")}</h2>
          <h3>{obsPeriod.location}, klo {obsPeriod.startTime} - {obsPeriod.endTime}</h3>


          <Table>
            <TableHead>
              <TableRow>

                <TableCell >{t("species")}</TableCell>
                <TableCell >{t("count")}</TableCell>
                <TableCell >{t("direction")}</TableCell>
                <TableCell >{t("bypassSide")}</TableCell>
                <TableCell >{t("notes")}</TableCell>
              </TableRow>
            </TableHead>


            <TableBody>
              {
                observations
                  .map((s, i) =>
                    <TableRow key={i} >
                      <TableCell>
                        {s.species}
                      </TableCell>
                      <TableCell>
                        {(s.count)}
                      </TableCell>
                      <TableCell>
                        {(globals.inverseDirections.get(s.direction))}, {(s.direction)}&#176;
                      </TableCell>
                      <TableCell>
                        {(globals.inverseBypass.get(s.bypassSide))}
                      </TableCell>
                      <TableCell>
                        {s.notes}
                      </TableCell>
                    </TableRow>
                  )
              }
            </TableBody>
          </Table>
        </div>
      </Fade>
    </Modal>

  );
};

ObservationPeriod.propTypes = {
  obsPeriod: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  periodId: PropTypes.string,
  handleErrorSnackOpen: PropTypes.func.isRequired,
};

export default ObservationPeriod;
