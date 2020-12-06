import {
  Backdrop, Fade, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getObservationsByObsPeriod } from "../../services";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
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
    if (obsPeriod === undefined) {
      console.error("obsPeriod is undefined");
      return;
    }
    getObservationsByObsPeriod(obsPeriod.id)
      .then(observationsJson => setObservations(observationsJson));
  }, [obsPeriod.id]);

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  if (!obsPeriod) return <div>obsPeriod is undefined!</div>;

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
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
                        {(globals.directions.get(s.direction))}, {(s.direction)}&#176;
                      </TableCell>
                      <TableCell>
                        {(globals.bypass.get(s.bypassSide))}
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
  periodId: PropTypes.string.isRequired,
  handleErrorSnackOpen: PropTypes.func.isRequired,
};

export default ObservationPeriod;
