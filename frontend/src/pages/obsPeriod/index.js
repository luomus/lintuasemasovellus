import {
  Backdrop, Fade, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getObservationsByObsPeriod } from "../../services";
import { useTranslation } from "react-i18next";



const ObservationPeriod = ({ obsPeriod, open, handleClose }) => {

  const useStyles = makeStyles(() => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: "white",
      border: "2px solid #000",
      height: "85%",
      width: "85%",
      padding: "2px 2px 2px 2px",
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

  const formatTime = (time) => {
    if (typeof time !== "undefined") {
      const ret = time.split(" ")[4].split(":");
      // hours 0 and minutes 1
      return `${ret[0]}:${ret[1]}`;
    }
  };

  const [observations, setObservations] = useState([]);

  useEffect(() => {
    if (obsPeriod === undefined) {
      console.error("obsPeriod is undefined");
      return;
    }
    getObservationsByObsPeriod(obsPeriod.id)
      .then(observationsJson => setObservations(observationsJson));
  }, [obsPeriod.id]);

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
          <h3>{obsPeriod.location}, klo {formatTime(obsPeriod.startTime)} - {formatTime(obsPeriod.endTime)}</h3>


          <Table>
            <TableHead>
              <TableRow>

                <TableCell >Laji</TableCell>
                <TableCell >Lukumäärä</TableCell>
                <TableCell >Suunta</TableCell>
                <TableCell >Ohitussuunta</TableCell>
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
                        {(s.direction)}
                      </TableCell>
                      <TableCell>
                        {(s.bypassSide)}
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
