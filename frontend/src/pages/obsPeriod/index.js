import { Backdrop, Button, Fade, Grid, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Selector from "./Selector";
import { postAddObservation } from "../../services";
import { useTranslation } from "react-i18next";



const ObservationPeriod = ({ periodId, open, handleClose, handleErrorSnackOpen }) => {

 

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

  const [species, setSpecies] = useState("");

  const observations = [
    {
      species: 'Hanhi',
      count: '3 naarasta, 4 koirasta',
      direction: 'Länsi',
      bypassSide: 'Vasen, 20 metriä'
    },
    {
      species: 'Kuukkeli',
      count: '500 naarasta',
      direction: 'Pohjoinen',
      bypassSide: 'Vasen, 20 metriä'
    },
    {
      species: 'Joutsen',
      count: '3 naarasta, 4 koirasta',
      direction: 'Länsi',
      bypassSide: 'Vasen, 20 metriä'
    }
  ]
  


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
                      <TableRow >
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
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  periodId: PropTypes.string.isRequired,
  handleErrorSnackOpen: PropTypes.func.isRequired,
};

export default ObservationPeriod;
