import {
  Fade, Modal, Grid, Button,
  MenuItem, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField, Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getShorthandText,
  sendEditedShorthand, deleteObservationperiods, getDaysObservationPeriodCounts
} from "../../services";
import CodeMirrorBlock from "../../globalComponents/codemirror/CodeMirrorBlock";
import Notification from "../../globalComponents/Notification";
import { AppContext } from "../../AppContext";
import { saveData } from "../../reducers/savingStateReducer";
import { shorthandLinesToObservations, shorthandTextToLines } from "../../shorthand/shorthandParsing";
import LoadingSpinner from "../../globalComponents/LoadingSpinner";


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


const EditShorthand = ({ day, dayId, open, handleCloseModal }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, station, speciesData } = useContext(AppContext);

  const [defaultShorthand, setDefaultShorthand] = useState([]);
  const [activeObservationPeriodIds, setActiveObservationPeriodIds] = useState([]);
  const [selectTypes, setSelectTypes] = useState([]);
  const [selectLocations, setSelectLocations] = useState([]);
  const [warning, setWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [observationPeriodCounts, setObservationPeriodCounts] = useState([]);

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [shorthand, setShorthand] = useState("");
  const [initialShorthand, setInitialShorthand] = useState("");

  const [countsLoading, setCountsLoading] = useState(true);
  const [countsFetchError, setCountsFetchError] = useState(false);
  const [shorthandLoading, setShorthandLoading] = useState(false);
  const [shorthandFetchError, setShorthandFetchError] = useState(false);

  const notifications = useSelector(state => state.notifications);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const retrieveCounts = async () => {
      setCountsLoading(true);
      setCountsFetchError(false);

      try {
        const counts = await getDaysObservationPeriodCounts(dayId);
        if (cancelled) {
          return;
        }
        setObservationPeriodCounts(counts);
      } catch (e) {
        if (cancelled) {
          return;
        }
        console.error(e);
        setCountsFetchError(true);
      } finally {
        if (!cancelled) {
          setCountsLoading(false);
        }
      }
    };

    retrieveCounts();

    return () => {
      cancelled = true;
    };
  }, [open, dayId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    const retrieveShorthand = async (type, location) => {
      setShorthandLoading(true);
      setShorthandFetchError(false);

      try {
        const res = await getShorthandText(dayId, type, location);
        if (cancelled) {
          return;
        }
        setDefaultShorthand(res);
        setActiveObservationPeriodIds(res.map(shorthandObj => shorthandObj.obsPeriodId));
        initializeDefaultShorthand(res);
      } catch (e) {
        if (cancelled) {
          return;
        }
        console.error(e);
        setShorthandFetchError(true);
      } finally {
        if (!cancelled) {
          setShorthandLoading(false);
        }
      }
    };

    if (type && location) {
      retrieveShorthand(type, location);
    }

    return () => {
      cancelled = true;
    };
  }, [open, type, location]);

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

    const typesWithLocations = selectTypes.filter(({ locationCount }) => (locationCount > 0));
    if (typesWithLocations.length === 1) {
      setType(typesWithLocations[0].type);
    }
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

    const locationsWithObservations = selectLocations.filter(({ observationPeriodCount }) => (observationPeriodCount > 0));
    if (locationsWithObservations.length === 1) {
      setLocation(locationsWithObservations[0].location);
    }
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
    let initialShorthand;
    if (text.replace(/(\r\n|\n|\r)/gm, "").trim() === "") {
      initialShorthand = "";
    } else {
      initialShorthand = text;
    }
    setShorthand(initialShorthand);
    setInitialShorthand(initialShorthand);
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
    const removable_ids = defaultShorthand.map(obsperiod => obsperiod.obsPeriodId);
    setSaving(true);
    try {
      await dispatch(saveData(() => deleteObservationperiods(removable_ids)));
      closeModal(true);
    } catch (e) {
      // error handled in saveData
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await dispatch(saveData(save));
      closeModal(true);
    } catch (e) {
      // error handled in saveData
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    const removable_ids = defaultShorthand.map(obsperiod => obsperiod.obsPeriodId);
    const rows = shorthandTextToLines(shorthand);
    const { observationPeriods, observations } = shorthandLinesToObservations(rows, type, location, speciesData.speciesCodeMap);
    await sendEditedShorthand(observationPeriods, observations, dayId, user.id, removable_ids);
  }

  const handleClose = () => {
    closeModal();
  };

  const closeModal = (afterSave = false) => {
    setType("");
    setLocation("");
    setShorthand("");
    setCountsLoading(true);
    setCountsFetchError(false);
    setShorthandLoading(false);
    setShorthandFetchError(false);
    handleCloseModal(afterSave);
  };

  const handleModalCloseEvent = () => {
    if (saving) {
      return;
    }

    let canClose = true;
    if (shorthand !== initialShorthand) {
      canClose = confirm(t("confirmExit"));
    }
    if (canClose) {
      closeModal();
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
          <h2> {t("editShorthand")}</h2>
          <h2> {day} </h2>
          {countsLoading ? (
            <LoadingSpinner size="small" />
          ) : countsFetchError ? (
            <Alert severity="error">
              {t("observationPeriodCountsFetchFailed")}
            </Alert>
          ) : (<>
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
                  disabled={saving}
                  slotProps={{
                    select: {
                      value: type,
                      onChange: (event) => {
                        setType(event.target.value);
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
                  disabled={!type || saving}
                  slotProps={{
                    select: {
                      value: location,
                      onChange: (event) => {
                        setLocation(event.target.value);
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
                {shorthandLoading ? (
                  <LoadingSpinner size="small" />
                ) : shorthandFetchError ? (
                  <Alert severity="error">
                    {t("shorthandFetchFailed")}
                  </Alert>
                ) : (
                  <CodeMirrorBlock
                    day={day}
                    type={type}
                    value={shorthand}
                    onChange={setShorthand}
                    activeObservationPeriodIds={activeObservationPeriodIds}
                    disabled={saving}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Notification category="shorthand" />
                <Notification category="nocturnalMigration" />
              </Grid>
              <Grid container item xs={12} alignItems="flex-end">
                <Box pr={2} pt={2}>
                  <Button
                    id="saveButtonInShorthandModification"
                    disabled={saveButtonIsDisabled() || saving}
                    variant="contained"
                    color="primary"
                    onClick={handleSave}>
                    {t("save")}
                  </Button>
                </Box>
                <Box pr={2} pt={2}>
                  <Button
                    id="cancelButtonInShorthandModification"
                    disabled={saving}
                    variant="contained"
                    color="secondary"
                    onClick={handleClose}>
                    {t("cancel")}
                  </Button>
                </Box>
                <Box pr={2} pt={2}>
                  <Button
                    id="removeButtonInShorthandModification"
                    disabled={deleteButtonIsDisabled() || saving}
                    variant="contained"
                    onClick={handleDialogOpen}
                    className={classes.deleteButton}>
                    {t("remove")}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>)}
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
  day: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
};

export default EditShorthand;
