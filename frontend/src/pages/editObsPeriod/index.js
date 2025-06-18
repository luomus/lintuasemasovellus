import {
  Fade, Modal, Grid, Button,
  Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getShorthandByObsPeriod, deleteObservationperiods, sendEditedShorthand
} from "../../services";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import Notification from "../../globalComponents/Notification";
import { AppContext } from "../../AppContext";
import { saveData } from "../../reducers/savingStateReducer";
import Select from "../../globalComponents/formComponents/Select";
import { shorthandTextToLines, shorthandLinesToObservations } from "../../shorthand/shorthandParsing";


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


const EditObsPeriod = ({ day, dayId, obsPeriod, open, handleCloseModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, station, speciesData } = useContext(AppContext);

  const notifications = useSelector(state => state.notifications);

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [shorthand, setShorthand] = useState("");
  const [initialShorthand, setInitialShorthand] = useState("");

  const [activeObservationPeriodIds, setActiveObservationPeriodIds] = useState([]);
  const [warning, setWarning] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => {
    if (open && obsPeriod.id) {
      setType(obsPeriod.observationType);
      setLocation(obsPeriod.location);
      getShorthandByObsPeriod(obsPeriod.id).then(shorthand => {
        initializeDefaultShorthand(shorthand);
      });
      setActiveObservationPeriodIds([obsPeriod.id]);
    }
  }, [open, obsPeriod]);

  const initializeDefaultShorthand = (shorthandblocks) => {
    let text = obsPeriod.startTime + "\n";
    for (const block of shorthandblocks) {
      text += block.shorthandBlock + "\n";
    }
    text += obsPeriod.endTime;
    setShorthand(text);
    setInitialShorthand(text);
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

  const handleDelete = async (close=true) => {
    setButtonsDisabled(true);
    await dispatch(saveData(() => deleteObservationperiods([Number(obsPeriod.id)])));
    setButtonsDisabled(false);
    if (close) {
      handleClose();
    }
  };


  const handleSave = async () => {
    await handleDelete(false);
    const rows = shorthandTextToLines(shorthand);
    const { observationPeriods, observations } = shorthandLinesToObservations(rows, type, location, speciesData.speciesCodeMap);

    setButtonsDisabled(true);
    await dispatch(saveData(() => sendEditedShorthand(observationPeriods, observations, obsPeriod.day_id, user.id)));
    setButtonsDisabled(false);
    handleClose();
  };

  const handleClose = () => {
    setType("");
    setLocation("");
    setShorthand("");
    handleCloseModal();
  };

  const handleModalCloseEvent = () => {
    let canClose = true;
    if (shorthand !== initialShorthand) {
      canClose = confirm(t("confirmExit"));
    }
    if (canClose) {
      handleClose();
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleModalCloseEvent}
      disableAutoFocus={true}
      closeAfterTransition
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2> {t("editShorthand")} </h2>
          <h3> {t("obsPeriod")} {day} {t("at")} {obsPeriod.startTime} - {obsPeriod.endTime} </h3>
          <Grid
            container
            alignItems="flex-start"
            spacing={1}>
            <Grid item xs={2}>
              <Select
                id="selectTypeInModification"
                label={t("type")}
                options={station.types}
                value={type}
                onChange={setType}
                required
              />
            </Grid>

            <Grid item xs={2}>
              <Select
                id="selectLocationInModification"
                label={t("location")}
                options={station.locations}
                value={location}
                onChange={setLocation}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CodeMirrorBlock
                day={day}
                dayId={dayId}
                type={type}
                value={shorthand}
                onChange={setShorthand}
                activeObservationPeriodIds={activeObservationPeriodIds}
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
                  disabled={saveButtonIsDisabled() || buttonsDisabled}
                  variant="contained"
                  color="primary"
                  onClick={handleSave}>
                  {t("save")}
                </Button>
              </Box>
              <Box pr={2} pt={2}>
                <Button
                  id="cancelButtonInShorthandModification"
                  disabled={buttonsDisabled}
                  variant="contained"
                  color="secondary"
                  onClick={handleClose}>
                  {t("cancel")}
                </Button>
              </Box>
              <Box pr={2} pt={2}>
                <Button
                  id="removeButtonInShorthandModification"
                  disabled={deleteButtonIsDisabled() || buttonsDisabled}
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
  day: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  obsPeriod: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

export default EditObsPeriod;
