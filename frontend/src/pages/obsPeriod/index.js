import {
  Backdrop, Fade, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getObservationsByObsPeriod } from "../../services";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";



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

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  if (!obsPeriod) return <div>obsPeriod is undefined!</div>;

  let directions = new Map();
  directions.set("0", "Pohjoinen");
  directions.set("22,5", "Pohjois-koillinen");
  directions.set("45", "Koillinen");
  directions.set("67,5", "Itä-koillinen");
  directions.set("90", "Itä");
  directions.set("112,5", "Itä-kaakko");
  directions.set("135", "Kaakko");
  directions.set("157,5", "Etelä-kaakko");
  directions.set("180", "Etelä");
  directions.set("202,5", "Etelä-lounas");
  directions.set("225", "Lounas");
  directions.set("247,5", "Länsi-lounas");
  directions.set("270", "Länsi");
  directions.set("292,5", "Länsi-luode");
  directions.set("315", "Luode");
  directions.set("337,5", "Pohjois-luode");
  directions.set("", "");

  let bypass = new Map();
  bypass.set("-4", "----");
  bypass.set("-3", "---");
  bypass.set("-2", "--");
  bypass.set("-1", "-");
  bypass.set("0", "+-");
  bypass.set("1", "+");
  bypass.set("2", "++");
  bypass.set("3", "+++");
  bypass.set("4", "++++");
  bypass.set("", "");

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
                        {(s.direction)}&#176;, {(directions.get(s.direction))}
                      </TableCell>
                      <TableCell>
                        {(bypass.get(s.bypassSide))}
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
