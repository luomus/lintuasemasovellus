import {
  Fade, Modal, Grid, Button,
  MenuItem, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {
  getShorthandText,
  sendEditedShorthand, deleteObservationperiods, getDaysObservationPeriodCounts, dateToDayString
} from "../../services";
import {
  loopThroughObservationPeriods, loopThroughObservations, setDayId
} from "../../shorthand/parseShorthandField";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import Notification from "../../globalComponents/Notification";
import { AppContext } from "../../AppContext";
import {setLocation, setShorthand, setType} from "../../reducers/formDataReducer/baseFormDataReducer";
import {emptyShorthand} from "../../reducers/formDataReducer/formDataReducer";
import {loopThroughCheckForErrors} from "../../shorthand/validations";


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


const EditShorthand = ({ dayList, dayId, open, handleCloseModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, station } = useContext(AppContext);

  const [defaultShorthand, setDefaultShorthand] = useState([]);
  const [activeObservationPeriodIds, setActiveObservationPeriodIds] = useState([]);
  const [selectTypes, setSelectTypes] = useState([]);
  const [selectLocations, setSelectLocations] = useState([]);
  const [warning, setWarning] = useState(false);
  const [observationPeriodCounts, setObservationPeriodCounts] = useState([]);

  const day = useSelector(state => state.formData.baseData.day);
  const type = useSelector(state => state.formData.baseData.type);
  const location = useSelector(state => state.formData.baseData.location);
  const shorthand = useSelector(state => state.formData.baseData.shorthand);
  const notifications = useSelector(state => state.notifications);

  useEffect(() => {
    if (!open) {
      return;
    }
    dispatch(emptyShorthand());
    getDaysObservationPeriodCounts(dayId).then(counts => {
      setObservationPeriodCounts(counts);
    });
  }, [open, dayId]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const retrieveShorthand = async (type, location) => {
      if (type && location){
        const res = await getShorthandText(dayId, type, location);
        setDefaultShorthand(res);
        setActiveObservationPeriodIds(res.map(shorthandObj => shorthandObj.obsPeriodId));
        initializeDefaultShorthand(res);
      }
    };

    if (type && location) {
      retrieveShorthand(type, location);
    }
  }, [open, type, location])

  useEffect(() => {
    if (!open) {
      return;
    }

    const locationCountByType = {};

    station.types.forEach(type => {
      locationCountByType[type] = 0;
    });

    observationPeriodCounts.forEach(({ observationType }) => {
      locationCountByType[observationType] += 1;
    });

    const selectTypes = station.types.map(type => ({ type, locationCount: locationCountByType[type] }));
    setSelectTypes(selectTypes);
  }, [open, station, observationPeriodCounts]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const obsPeriodCountByLocation = {};

    station.locations.forEach(location => {
      obsPeriodCountByLocation[location] = 0;
    });

    observationPeriodCounts.forEach(({ observationType, location, observationPeriodCount }) => {
      if (type === observationType) {
        obsPeriodCountByLocation[location] += observationPeriodCount;
      }
    });

    const selectLocations = station.locations.map(location => ({ location, observationPeriodCount: obsPeriodCountByLocation[location] }));
    setSelectLocations(selectLocations);
  }, [open, type, station, observationPeriodCounts]);

  const initializeDefaultShorthand = (defaultShorthand) => {
    let text = "";
    for (const shorthandObject of defaultShorthand) {
      text += shorthandObject.startTime + "\n";
      for (const shorthandObject2 of shorthandObject.shorthands) {
        text += shorthandObject2.shorthand_text + "\n";
      }
      text += shorthandObject.endTime + "\n";
    }
    if (text.replace(/(\r\n|\n|\r)/gm, "").trim() === "") {
      dispatch(setShorthand(""));
    } else {
      dispatch(setShorthand(text));
    }
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
    let removable_ids = [];
    for (const obsperiod of defaultShorthand) {
      removable_ids.push(obsperiod.obsPeriodId);
    }
    await deleteObservationperiods(removable_ids);
    handleClose();
  };

  const handleSave = async () => {
    await handleDelete();
    setDayId(dayId);
    const rows = loopThroughCheckForErrors(shorthand);
    const periods = loopThroughObservationPeriods(rows, type, location);
    const observations = loopThroughObservations(rows, user.id);

    await sendEditedShorthand(periods, observations, dayId, user.id);
    handleClose();
  };

  const handleClose = () => {
    dispatch(emptyShorthand());
    handleCloseModal();
  };

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
          <h2> {t("editShorthand")}</h2>
          <h2> {day} </h2>
          <h3> {t("chooseTypeAndLocation")}</h3>
          <Grid
            container
            alignItems="flex-start"
            spacing={1}>
            <Grid item xs={2}>
              <TextField
                className={classes.formControl}
                select
                required
                fullWidth
                label={t("type")}
                id="selectTypeInModification"
                slotProps={{
                  select: {
                    value: type,
                    onChange: (event) => {
                      dispatch(setType(event.target.value));
                    }
                  }
                }}
              >
                {
                  selectTypes.map(({ type, locationCount }, i) =>
                    <MenuItem id={type} value={type} key={i}>
                      {type} ({t("locationCount", { count: locationCount })})
                    </MenuItem>
                  )
                }
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <TextField
                className={classes.formControl}
                select
                required
                fullWidth
                label={t("location")}
                id="selectLocationInModification"
                disabled={!type}
                slotProps={{
                  select: {
                    value: location,
                    onChange: (event) => {
                      dispatch(setLocation(event.target.value));
                    }
                  }
                }}
              >
                {
                  selectLocations.map(({ location, observationPeriodCount }, i) =>
                    <MenuItem id={location} value={location} key={i}>
                      {location} ({t("observationPeriodCount", { count: observationPeriodCount })})
                    </MenuItem>
                  )
                }
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <CodeMirrorBlock
                activeObservationPeriodIds={activeObservationPeriodIds}
                dayList={dayList}
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

EditShorthand.propTypes = {
  dayList: PropTypes.array,
  dayId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

export default EditShorthand;
