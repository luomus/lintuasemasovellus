import {
  Backdrop, Fade, Modal, Grid, Button,
  FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import {
  getShorthandByObsPeriod, deleteObservationperiods, sendEditedShorthand
} from "../../services";
import {
  loopThroughObservationPeriods, loopThroughObservations, setDayId
} from "../../shorthand/parseShorthandField";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import Notification from "../../globalComponents/Notification";


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
  errorPaper: {
    background: "#f5f890",
    padding: "20px 30px",
    marginTop: "10px",
    maxHeight: "8vw",
    overflow: "auto",
  },
  errorHeading: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  deleteButton: {
    color: "white",
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
  root: {
    "& .MuiFormControl-root": {
      width: "70%",
      margin: "1em"
    }
  },
}));


const EditObsPeriod = ({ date, obsPeriod, open, handleClose }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [shorthand, setShorthand] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [warning, setWarning] = useState(false);
  const [sanitizedShorthand, setSanitizedShorthand] = useState("");

  const userID = useSelector(state => state.user.id);

  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);
  const notifications = useSelector(state => state.notifications);

  const initializeDefaultShorthand = (shorthandblocks) => {
    let text = obsPeriod.startTime + "\n";
    for (const block of shorthandblocks) {
      text += block.shorthandBlock + "\n";
    }
    text += obsPeriod.endTime;
    setShorthand(text);
  };

  const handleDialogOpen = () => {
    setWarning(true);
  };

  const handleDialogClose = () => {
    setWarning(false);
  };

  const handleDialogConfirm = () => {
    setWarning(false);
    handleDelete();
  };

  const saveButtonIsDisabled = (category = "shorthand") => {
    if (!shorthand.trim()) return true;
    let value = false;
    Object.keys(notifications).map(cat => {
      if (cat === category) {
        Object.keys(notifications[String(cat)]).map(row => {
          if (notifications[String(cat)][String(row)].errors.length > 0) {
            value = true;
          }
        });
      }
    });
    return value;
  };

  const deleteButtonIsDisabled = () => {
    if (shorthand.replace(/(\r\n|\n|\r)/gm, "").trim() === "" || location === "" || type === "") {
      return true;
    } else {
      return false;
    }
  };

  const handleDelete = async () => {
    await deleteObservationperiods([Number(obsPeriod.id)]);
    handleClose();
  };


  const handleSave = async () => {
    await handleDelete();
    setDayId(obsPeriod.day_id);
    const rows = sanitizedShorthand;
    const periods = loopThroughObservationPeriods(rows, type, location);
    const observations = loopThroughObservations(rows, userID);

    await sendEditedShorthand(periods, observations, obsPeriod.day_id, userID);
    handleClose();
  };


  useEffect(() => {
    if (obsPeriod.id) {
      setType(obsPeriod.observationType);
      setLocation(obsPeriod.location);
      getShorthandByObsPeriod(obsPeriod.id).then(shorthand => {
        initializeDefaultShorthand(shorthand);
      });
    }
  }, [obsPeriod]);


  useEffect(() => {
    if (userObservatory !== "") {
      setTypes(
        stations
          .find(s => s.observatory === userObservatory)
          .types
      );
    }
  });

  useEffect(() => {
    if (userObservatory !== "") {
      setLocations(
        stations
          .find(s => s.observatory === userObservatory)
          .locations
      );
    }
  });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      disableAutoFocus={true}
      closeAfterTransition
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2> {t("editShorthand")} </h2>
          <h3> {t("obsPeriod")} {date} {t("at")} {obsPeriod.startTime} - {obsPeriod.endTime} </h3>
          <Grid
            container
            alignItems="flex-start"
            spacing={1}>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Tyyppi">{t("type")}</InputLabel>
                <Select required
                  label="type"
                  fullWidth={true}
                  id="selectTypeInModification"
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value);
                  }}
                >
                  {
                    types.map((type, i) =>
                      <MenuItem id={type} value={type} key={i}>
                        {type}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Location">{t("location")}</InputLabel>
                <Select required
                  label="location"
                  id="selectLocationInModification"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                  }}
                >
                  {
                    locations.map((location, i) =>
                      <MenuItem id={location} value={location} key={i}>
                        {location}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <CodeMirrorBlock
                setSanitizedShorthand={setSanitizedShorthand}
                setShorthand={setShorthand}
                shorthand={shorthand}
                date={new Date(date)}
                type={type}
              />
            </Grid>
            <Grid item xs={12}>
              <Notification category="shorthand" />
              <Notification category="nocturnalMigration" />
            </Grid>
            <Grid container item xs={12} alignItems="flex-end">
              <Box pr={2} pt={2}>
                <Button
                  id="saveButtonInShorthandModification"
                  disabled={saveButtonIsDisabled()}
                  variant="contained"
                  color="primary"
                  onClick={handleSave}>
                  {t("save")}
                </Button>
              </Box>
              <Box pr={2} pt={2}>
                <Button
                  id="cancelButtonInShorthandModification"
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}>
                  {t("cancel")}
                </Button>
              </Box>
              <Box pr={2} pt={2}>
                <Button
                  id="removeButtonInShorthandModification"
                  disabled={deleteButtonIsDisabled()}
                  variant="contained"
                  onClick={handleDialogOpen}
                  className={classes.deleteButton}>
                  {t("remove")}
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Dialog
            open={warning}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{t("confirmDeletion")}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t("removingCannotBeCancelled")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogConfirm} color="error" id="confirmButton">
                {t("confirm")}
              </Button>
              <Button onClick={handleDialogClose} color="default" id="cancelButton" autoFocus>
                {t("cancel")}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Fade>
    </Modal>
  );
};

EditObsPeriod.propTypes = {
  date: PropTypes.string.isRequired,
  obsPeriod: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditObsPeriod;
