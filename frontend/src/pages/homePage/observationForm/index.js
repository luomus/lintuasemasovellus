import React, { useCallback, useEffect, useState } from "react";
import { Button, CircularProgress, Grid, Snackbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "../../../globalComponents/Alert";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import { loopThroughObservationPeriods, loopThroughObservations, } from "../../../shorthand/parseShorthandField";
import { getCatches, getDays, searchDayInfo, sendDay, sendEverything } from "../../../services";
import { retrieveDays, setDays } from "../../../reducers/daysReducer";
import { setDailyActions, setDefaultActions } from "../../../reducers/dailyActionsReducer";
import { setCatches } from "../../../reducers/catchRowsReducer";
import { resetNotifications } from "../../../reducers/notificationsReducer";
import Help from "../../../globalComponents/Help";
import { addDraft, deleteDraft } from "../../../services/draftService";
// import { useConfirmBrowserExit } from "../../../hooks/useConfirmBrowserExit";
import { ObservationFormHeader } from "./ObservationFormHeader";
import { ObservationFormMainSection } from "./ObservationFormMainSection";
import { ObservationFormDrafts } from "./ObservationFormDrafts";
import { ObservationFormCopy } from "./ObservationFormCopy";

const useStyles = makeStyles(() => ({
  sendButton: {
    marginBottom: "20px",
    marginRight: "10px",
    marginTop: "20px",
    position: "static"
  },
  loadingIcon: {
    padding: "0px 5px 0px 0px",
    margin: "10px"
  },
  buttonAndIconsContainer: {
    display: "flex",
    alignItems: "center"
  }
}
));

const formatDate = (date) => {
  if (date === null) {
    return;
  }
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  return `${dd > 9 ? "" : "0"}${dd}.${mm > 9 ? "" : "0"}${mm}.${date.getFullYear()}`;
};

export const ObservationForm = ({ user, userObservatory, onSaveSuccess }) => {
  const classes = useStyles();

  const { t } = useTranslation();
  // const confirmBrowserExit = useConfirmBrowserExit();

  const dateNow = new Date();

  const dailyActions = useSelector(state => state.dailyActions);
  const catchRows = useSelector(state => state.catchRows);
  const notifications = useSelector(state => state.notifications);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [day, setDay] = useState(dateNow);
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [shorthand, setShorthand] = useState("");
  const [sanitizedShorthand, setSanitizedShorthand] = useState("");
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [saveLoadingIcon, setSaveLoadingIcon] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);
  const [dateChangeConfirm, setDateChangeConfirm] = useState(false);
  const [draftID, setDraftID] = useState();
  //const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    dispatch(retrieveDays());
    handleDateChange(dateNow);
  }, []);

  /*useEffect(() => {
    if (hasChanges) {
      confirmBrowserExit.enable();
    } else {
      confirmBrowserExit.disable();
    }
  }, [hasChanges]);*/

  useEffect(() => {
    if (!type && !location && !shorthand) return;
    let data = {
      day: formatDate(day),
      comment,
      observers,
      observatory: userObservatory,
      selectedactions: stringifyDailyActions(),
      userID: user.id,
      type,
      location,
      shorthand: shorthand,
      catchRows: JSON.stringify(catchRows),
    };
    if (draftID === undefined) {
      addDraft(data).then(r => {
        setDraftID(r);
      });
    } else {
      addDraft({ ...data, id: draftID });
    }
  }, [day, shorthand, type, location, comment, observers, catchRows]);

  const emptyAllFields = () => {
    setType("");
    setLocation("");
    setShorthand("");
  };

  const setActions = (selectedActions) => {
    if (selectedActions) {
      dispatch(setDailyActions(JSON.parse(selectedActions)));
    } else {
      dispatch(setDefaultActions(userObservatory));
    }
  };

  const setCatchRows = (dayId) => {
    if (dayId !== undefined && dayId !== null) {
      getCatches(dayId)
        .then(res => dispatch(setCatches(res)));
    } else {
      dispatch(setCatches([]));
    }
  };

  const stringifyDailyActions = () => {
    if ("attachments" in dailyActions) {
      if (dailyActions.attachments === "" || dailyActions.attachments < 0) {
        return JSON.stringify({ ...dailyActions, "attachments": 0 });
      }
    }
    return JSON.stringify(dailyActions);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };

  const sendData = async () => {
    setSaveLoadingIcon(true);
    const rows = sanitizedShorthand;
    const observationPeriodsToSend = loopThroughObservationPeriods(rows, type, location);
    const observationsToSend = loopThroughObservations(rows, user.id);
    setSaveDisabled(true);
    let data = {
      day: formatDate(day),
      comment: comment,
      observers: observers,
      observatory: userObservatory,
      selectedactions: stringifyDailyActions(),
      userID: user.id,
      catches: catchRows,
      observationPeriods: observationPeriodsToSend,
      observations: observationsToSend
    };

    try {
      await sendEverything(data);
      setFormSent(true);
      emptyAllFields();
      dispatch(retrieveDays());
      deleteDraft(draftID);
      setDraftID(undefined);
      onSaveSuccess();
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
    setSaveLoadingIcon(false);
    setSaveDisabled(false);
  };

  const handleToDayDetails = async () => {
    try {
      const searchResult = await searchDayInfo(formatDate(day), userObservatory);
      //Update if observers is changed
      if (searchResult[0].observers !== observers) {
        const data = {
          day: formatDate(day),
          observers: observers,
          observatory: userObservatory,
          comment: searchResult[0].comment,
          selectedactions: searchResult[0].selectedactions === ""
            ? JSON.stringify(dispatch(setDefaultActions(userObservatory)).data.dailyActions)
            : searchResult[0].selectedactions
        };
        await sendDay(data);
        const days = await getDays();
        dispatch(setDays(days));
      }
      navigate(`/daydetails/${formatDate(day)}`);
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
  };

  const confirmDate = () => {
    setDateChangeConfirm(true);
    setTimeout(function () {
      setDateChangeConfirm(false);
    }, 10000);
  };

  const saveButtonDisabled = () => {
    if (observers === "" || observers.trim() === "" || type === "" || location === "" || shorthand.trim() === "" || errorsInInput())
      return true;
    else
      return false;
  };

  const errorsInInput = useCallback((category = "all") => {
    let value = false;
    Object.keys(notifications).map(cat => {
      if (cat === category || category === "all") {
        Object.keys(notifications[String(cat)]).map(row => {
          if (notifications[String(cat)][String(row)].errors.length > 0) {
            value = true;
          }
        });
      }
    });
    return value;
  }, [notifications]);

  const handleCopyDay = (copyDay, toCopy) => {
    searchDayInfo(formatDate(copyDay), userObservatory).then((dayJson) => {
      if (dayJson[0]["id"] !== 0) {
        if (toCopy.observers) {
          setObservers(dayJson[0]["observers"]);
        }
        if (toCopy.comment) {
          setComment(dayJson[0]["comment"]);
        }
        if (toCopy.observationActivity) {
          setActions(dayJson[0]["selectedactions"]);
        }
        if (toCopy.catches) {
          setCatchRows(dayJson[0]["id"]);
        }
        dispatch(resetNotifications());
      }
    });
  };

  const handleDateChange = (date) => {
    const setFields = (dayData) => {
      setObservers(dayData["observers"] || "");
      setComment(dayData["comment"] || "");
      setActions(dayData["selectedactions"]);
      setCatchRows(dayData["id"]);
      dispatch(resetNotifications());
    };

    if ((catchRows.length === 0 && observers === "" && comment === "") || dateChangeConfirm) {
      const newDate = date;
      setDay(date);

      if (newDate) {
        searchDayInfo(formatDate(date), userObservatory).then((dayJson) => {
          setFields(dayJson[0]);
        });
      } else {
        setFields({});
      }
    } else if (confirm(t("changeDateWhenObservationsConfirm"))) {
      confirmDate();
      setDay(date);
      if (date) {
        searchDayInfo(formatDate(date), userObservatory).then((dayJson) => {
          setFields(dayJson[0]);
        });
      } else {
        setFields({});
      }
    }
  };

  const handleDraftSelect = (el) => {
    setDraftID(undefined);
    setType(el.type);
    setLocation(el.location);
    setShorthand(el.shorthand);
    setComment(el.comment);
    setActions(el.selectedactions);
    setObservers(el.observers);
    dispatch(setCatches(JSON.parse(el.catchRows)));
  };

  return (
    <>
      <Grid container
        alignItems="flex-start"
        spacing={1}>
        <Grid item xs={10} >
          <Typography variant="h4" component="h2" >
            {t("addObservations")} - {userObservatory.replace("_", " ")}
          </Typography>
          <br />
        </Grid>
        <Grid container item xs={2} justifyContent="flex-end">
          <ObservationFormDrafts user={user} userObservatory={userObservatory} draftID={draftID} onDraftSelect={handleDraftSelect} />
          <ObservationFormCopy day={day} onCopyDay={handleCopyDay} />
        </Grid>
        <ObservationFormHeader
          day={day}
          observers={observers}
          onDayChange={handleDateChange}
          onObserversChange={setObservers}
          toDayDetails={handleToDayDetails}
        />
        <ObservationFormMainSection
          userObservatory={userObservatory}
          day={day}
          errorsInInput={errorsInInput}
          comment={comment}
          setComment={setComment}
          type={type}
          setType={setType}
          location={location}
          setLocation={setLocation}
          shorthand={shorthand}
          setShorthand={setShorthand}
          onSanitizedShorthandChange={setSanitizedShorthand}
        />

        <Grid item xs={12} className={classes.buttonAndIconsContainer}>
          <Button
            id="saveButton"
            className={classes.sendButton}
            onClick={sendData}
            disabled={saveButtonDisabled() || saveDisabled}
            color="primary"
            variant="contained"
          >
            {saveDisabled ? t("loading") : t("saveMigrant")}
          </Button>
          <Help title={t("helpForSaveMigrantButton")} placement="right"/>
          { (saveLoadingIcon) &&
            <CircularProgress className={classes.loadingIcon} color="primary"/>
          }
        </Grid>
      </Grid>

      <Snackbar open={formSent} autoHideDuration={5000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success">
          {t("formSent")}
        </Alert>
      </Snackbar>
      <Snackbar open={errorHappened} autoHideDuration={5000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="error">
          {t("formNotSent")}
        </Alert>
      </Snackbar>
    </>
  );
};

ObservationForm.propTypes = {
  user: PropTypes.object.isRequired,
  userObservatory: PropTypes.string.isRequired,
  onSaveSuccess: PropTypes.func.isRequired
};
