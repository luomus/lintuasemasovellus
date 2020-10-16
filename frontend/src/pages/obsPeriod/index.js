import { Backdrop, Button, Fade, Grid, makeStyles, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@material-ui/core";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Selector from "./Selector";
import { postAddObservation } from "../../services";



const ObservationPeriod = ({ obsPeriodId, open, handleClose, handleErrorSnackOpen }) => {

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

  const classes = useStyles();

  const [species, setSpecies] = useState("");

  const [adultUnknownCount, setAdultUnknownCount] = useState(0);
  const [adultFemaleCount, setAdultFemaleCount] = useState(0);
  const [adultMaleCount, setAdultMaleCount] = useState(0);
  const [juvenileUnknownCount, setJuvenileUnknownCount] = useState(0);
  const [juvenileFemaleCount, setJuvenileFemaleCount] = useState(0);
  const [juvenileMaleCount, setJuvenileMaleCount] = useState(0);
  const [subadultUnknownCount, setSubadultUnknownCount] = useState(0);
  const [subadultFemaleCount, setSubadultFemaleCount] = useState(0);
  const [subadultMaleCount, setSubadultMaleCount] = useState(0);
  const [unknownUnknownCount, setUnknownUnknownCount] = useState(0);


  const [direction, setDirection] = useState("");
  const [bypassSide, setBypassSide] = useState("");
  const [notes, setNotes] = useState("");

  const addObservation = () => {

    const postMe = {
      species,
      adultUnknownCount,
      adultFemaleCount,
      adultMaleCount,
      juvenileUnknownCount,
      juvenileFemaleCount,
      juvenileMaleCount,
      subadultUnknownCount,
      subadultFemaleCount,
      subadultMaleCount,
      unknownUnknownCount,
      direction,
      bypassSide,
      notes,
      observationperiod_id: obsPeriodId,
    };
    postAddObservation(postMe)
      .then(response => {
        console.log("sent observation response:", response);
        if (response.status === 200) {
          handleClose(true);
        } else {
          //errors
          console.log("eeeeeeeeeerrrrrrorrrrrrr");
          handleClose(true);
          handleErrorSnackOpen();
        }
      })
      .catch(() => {
        handleClose(true);
        handleErrorSnackOpen();
      });
  };

  console.log(obsPeriodId);


  // TODO:lisää lokalisaatioon fiksut nimet näille
  const directionOptions = ["north", "east", "south", "west"];
  // tietäjä: kirjoita bypassOptions:
  // const bypassOptions = [""];

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
          <h2 id="transition-modal-title">Havaintolomake</h2>
          <p id="transition-modal-description">Ole hyvä ja lisää havainto</p>
          <form className={classes.root} onSubmit={addObservation}>
            <TextField required
              label={"laji"}
              onChange={(event) => setSpecies(event.target.value)}
              value={species}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">juvenile</TableCell>
                  <TableCell align="right">subadult</TableCell>
                  <TableCell align="right">adult</TableCell>
                  <TableCell align="right">unknown</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>male</TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setJuvenileMaleCount(event.target.value)}
                      value={juvenileMaleCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setSubadultMaleCount(event.target.value)}
                      value={subadultMaleCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setAdultMaleCount(event.target.value)}
                      value={adultMaleCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    no data
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>female</TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setJuvenileFemaleCount(event.target.value)}
                      value={juvenileFemaleCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setSubadultFemaleCount(event.target.value)}
                      value={subadultFemaleCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setAdultFemaleCount(event.target.value)}
                      value={adultFemaleCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    no data
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>unknown</TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setJuvenileUnknownCount(event.target.value)}
                      value={juvenileUnknownCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setSubadultUnknownCount(event.target.value)}
                      value={subadultUnknownCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setAdultUnknownCount(event.target.value)}
                      value={adultUnknownCount}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <TextField required
                      type="number"
                      onChange={(event) => setUnknownUnknownCount(event.target.value)}
                      value={unknownUnknownCount}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Selector
                  value={direction} onChange={(event) => setDirection(event.target.value)}
                  options={directionOptions} labelId={"Suunta"}
                />
              </Grid>
              <Grid item xs={6}>
                <Selector
                  value={bypassSide} onChange={(event) => setBypassSide(event.target.value)}
                  options={directionOptions} labelId={"Ohitussuunta"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={4}
                  label={"Muistiinpanot"}
                  onChange={(event) => setNotes(event.target.value)}
                  value={notes}
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={addObservation} variant="contained"
                  color="primary"
                  disableElevation
                >
                  Tallenna
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Fade>
    </Modal>

  );
};

ObservationPeriod.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  obsPeriodId: PropTypes.string.isRequired,
  handleErrorSnackOpen: PropTypes.func.isRequired,
};

export default ObservationPeriod;
