import React, { useCallback, useContext, useEffect, useState } from "react";
import { Grid, Snackbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "../../../globalComponents/Alert";
import { shorthandTextToLines, loopThroughObservationPeriods, loopThroughObservations } from "../../../shorthand/parseShorthandField";
import {
  dayInfoToFormData,
  getEmptyFormData, objectsDiffer,
  searchDayInfo,
  sendDay,
  sendEverything, stringifyDailyActions
} from "../../../services";
import { ObservationFormMain } from "./ObservationFormMain";
import LoadingSpinner from "../../../globalComponents/LoadingSpinner";
import { AppContext } from "../../../AppContext";
import { dateToDayString } from "../../../services";
import { addDraft, deleteDraft } from "../../../services/draftService";
import ObservationFormDrafts from "./ObservationFormDrafts";
import ObservationFormCopy from "./ObservationFormCopy";
import { useConfirmExit } from "../../../hooks/useConfirmExit";
import { resetNotifications } from "../../../reducers/notificationsReducer";

const useStyles = makeStyles(() => ({
  fieldsContainer: {
    border: "none",
    padding: 0,
    margin: 0
  }
}
));

export const ObservationForm = ({ onSaveSuccess }) => {
  const classes = useStyles();

  const { t } = useTranslation();
  const { user, observatory, station } = useContext(AppContext);

  const navigate = useNavigate();

  const [dayId, setDayId] = useState();
  const [savedFormData, setSavedFormData] = useState();
  const [formData, setFormData] = useState(getEmptyFormData(dateToDayString(new Date())));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDayChange, setConfirmDayChange] = useState(false);
  const [toDayDetailsLoading, setToDayDetailsLoading] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);

  const [draftID, setDraftID] = useState();
  const [navigateToDayDetailsDay, setNavigateToDayDetailsDay] = useState(null);

  useConfirmExit(
    () => formHasChanges(),
    () => {
      resetNotifications();
    }
  );

  useEffect(() => {
    setLoading(true);
    updateFormDataAfterDayChange(formData.day).then(() => {
      setLoading(false);
    });
  }, [formData.day]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateDraft();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  useEffect(() => {
    if (navigateToDayDetailsDay) {
      navigate(`/daydetails/${navigateToDayDetailsDay}`);
      setNavigateToDayDetailsDay(null);
    }
  }, [navigateToDayDetailsDay]);

  useEffect(() => {
    if (!savedFormData) {
      return;
    }
    if (objectsDiffer(formData, savedFormData, ["observers", "comment", "dailyActions", "catchRows"])) {
      setConfirmDayChange(true);
    } else {
      setConfirmDayChange(false);
    }
  }, [savedFormData, formData.observers, formData.comment, formData.dailyActions, formData.catchRows]);

  const updateFormDataAfterDayChange = async (day) => {
    let dayInfo = {};
    if (day) {
      dayInfo = await searchDayInfo(day, observatory);
    }

    setDayId(dayInfo.id);

    const initialData = dayInfoToFormData(day, dayInfo, station.defaultActions);
    setSavedFormData(initialData);

    const { type, location, shorthand } = formData;
    setFormData({ ...initialData, type, location, shorthand });
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };

  const sendData = async (formData) => {
    setSaving(true);
    const { day, observers, comment, dailyActions, catchRows, type, location, shorthand } = formData;

    const rows = shorthandTextToLines(shorthand);
    const observationPeriodsToSend = loopThroughObservationPeriods(rows, type, location);
    const observationsToSend = loopThroughObservations(rows, user.id);

    let data = {
      day,
      comment,
      observers,
      observatory,
      selectedactions: stringifyDailyActions(dailyActions),
      userID: user.id,
      catches: catchRows,
      observationPeriods: observationPeriodsToSend,
      observations: observationsToSend
    };
    const formDataAfterSave = { ...formData, type: "", location: "", shorthand: "" };

    try {
      await sendEverything(data);
      setSaving(false);
      setFormSent(true);
      if (draftID) {
        deleteDraft(draftID);
      }
      setDraftID(undefined);
      setSavedFormData(formDataAfterSave);
      setFormData(formDataAfterSave);
      onSaveSuccess();
    } catch (error) {
      console.error(error.message);
      setSaving(false);
      setErrorHappened(true);
    }
  };

  const handleToDayDetails = async (formData) => {
    setToDayDetailsLoading(true);

    const { day, observers } = formData;

    try {
      const searchResult = await searchDayInfo(day, observatory);

      if (searchResult.observers !== observers) {
        const selectedactions = searchResult.selectedactions ? searchResult.selectedactions : station.defaultActions;
        const data = {
          day,
          observers: observers,
          observatory: observatory,
          comment: searchResult.comment,
          selectedactions: JSON.stringify(selectedactions)
        };
        await sendDay(data);
        setSavedFormData({ ...savedFormData, observers });
      }

      setNavigateToDayDetailsDay(day);
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }

    setToDayDetailsLoading(false);
  };

  const handleDraftSelect = useCallback((el) => {
    setDraftID(undefined);
    setFormData({
      ...el,
      dailyActions: el.selectedactions ? JSON.parse(el.selectedactions) : station.defaultActions,
      catchRows: JSON.parse(el.catchRows)
    });
  }, [station]);

  const handleCopyDay = useCallback((copyDay, toCopy) => {
    searchDayInfo(copyDay, observatory).then(dayInfo => {
      if (dayInfo["id"] !== undefined && dayInfo["id"] !== null) {
        const newFormData = {};
        if (toCopy.observers) {
          newFormData.observers = dayInfo["observers"];
        }
        if (toCopy.comment) {
          newFormData.comment = dayInfo["comment"];
        }
        if (toCopy.observationActivity) {
          newFormData.dailyActions = dayInfo["selectedactions"];
        }
        if (toCopy.catches) {
          newFormData.catchRows = dayInfo["catches"];
        }
        setFormData(prevFormData => ({ ...prevFormData, ...newFormData }));
      }
    });
  }, [observatory]);

  const updateDraft = () => {
    const { day, observers, comment, dailyActions, catchRows, type, location, shorthand } = formData;

    if (!type && !location && !shorthand) return;
    let data = {
      day,
      comment,
      observers,
      observatory,
      selectedactions: stringifyDailyActions(dailyActions),
      userID: user.id,
      type,
      location,
      shorthand: shorthand,
      catchRows: JSON.stringify(catchRows)
    };
    if (draftID === undefined) {
      addDraft(data).then(r => {
        setDraftID(r);
      });
    } else {
      addDraft({ ...data, id: draftID });
    }
  };

  const formHasChanges = () => {
    if (!savedFormData) {
      return false;
    }

    return objectsDiffer(formData, savedFormData);
  };

  return (
    <LoadingSpinner overlay={true} spinning={loading}>
      <fieldset disabled={loading} className={classes.fieldsContainer}>
        <Grid container
          alignItems="flex-start"
          spacing={1}>
          <Grid item xs={10} >
            <Typography variant="h4" component="h2" >
              {t("addObservations")} - {observatory.replace("_", " ")}
            </Typography>
            <br />
          </Grid>
          <Grid container item xs={2} justifyContent="flex-end">
            <ObservationFormDrafts draftID={draftID} onDraftSelect={handleDraftSelect} />
            <ObservationFormCopy day={formData.day} onCopyDay={handleCopyDay} />
          </Grid>
        </Grid>
        <ObservationFormMain
          formData={formData}
          dayId={dayId}
          toDayDetailsLoading={toDayDetailsLoading}
          saving={saving}
          confirmDayChange={confirmDayChange}
          onToDayDetails={handleToDayDetails}
          onSave={sendData}
          onFormDataChange={setFormData}
        />

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
      </fieldset>
    </LoadingSpinner>
  );
};

ObservationForm.propTypes = {
  onSaveSuccess: PropTypes.func.isRequired
};
