import React, { useCallback, useContext, useEffect, useState } from "react";
import { Grid, Snackbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "../../../globalComponents/Alert";
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
import { shorthandLinesToObservations, shorthandTextToLines } from "../../../shorthand/shorthandParsing";
import { useDispatch, useSelector } from "react-redux";
import { refreshDayData, resetDayData } from "../../../reducers/dayDataReducer";

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
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { user, observatory, station, speciesData } = useContext(AppContext);

  const navigate = useNavigate();

  const dayInfo = useSelector((state) => state.dayData.data?.dayInfo);
  const loading = useSelector((state) => state.dayData.loading);
  const error = useSelector((state) => state.dayData.error);

  const [initialFormData, setInitialFormData] = useState();
  const [formData, setFormData] = useState(getEmptyFormData(dateToDayString(new Date())));

  const [confirmDayChange, setConfirmDayChange] = useState(false);

  const [toDayDetailsLoading, setToDayDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);
  const [copyErrorHappened, setCopyErrorHappened] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const [draftID, setDraftID] = useState();
  const [navigateToDayDetailsDay, setNavigateToDayDetailsDay] = useState(null);

  useConfirmExit(
    () => formHasChanges(),
    () => {
      dispatch(resetNotifications());
      dispatch(resetDayData());
    }
  );

  useEffect(() => {
    dispatch(refreshDayData(formData.day, observatory));
  }, [formData.day, observatory]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const initialData = dayInfoToFormData(formData.day, dayInfo || {}, station.defaultActions);
    setInitialFormData(initialData);

    const { type, location, shorthand } = formData;
    setFormData({ ...initialData, type, location, shorthand });
  }, [dayInfo, loading]);

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
    if (!initialFormData) {
      return;
    }
    if (objectsDiffer(formData, initialFormData, ["observers", "comment", "dailyActions", "catchRows"])) {
      setConfirmDayChange(true);
    } else {
      setConfirmDayChange(false);
    }
  }, [initialFormData, formData.observers, formData.comment, formData.dailyActions, formData.catchRows]);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
    setCopyErrorHappened(false);
  };

  const sendData = async (formData) => {
    setSaving(true);
    setErrorHappened(false);

    const { day, observers, comment, dailyActions, catchRows, type, location, shorthand } = formData;

    try {
      const lines = shorthandTextToLines(shorthand);
      const { observationPeriods, observations } = shorthandLinesToObservations(lines, type, location, speciesData.speciesCodeMap);

      let data = {
        day,
        comment,
        observers,
        observatory,
        selectedactions: stringifyDailyActions(dailyActions),
        userID: user.id,
        catches: catchRows,
        observationPeriods,
        observations
      };

      await sendEverything(data);
      setSaving(false);
      setFormSent(true);
      if (draftID) {
        deleteDraft(draftID);
      }
      setDraftID(undefined);
      setFormData(getEmptyFormData(day));
      onSaveSuccess();

      dispatch(refreshDayData(day, observatory));
    } catch (error) {
      console.error(error);
      setSaving(false);
      setErrorHappened(true);
    }
  };

  const handleToDayDetails = async (formData) => {
    setToDayDetailsLoading(true);
    setErrorHappened(false);

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
        setInitialFormData({ ...initialFormData, observers });
      }

      setNavigateToDayDetailsDay(day);
    } catch (error) {
      console.error(error);
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

  const handleCopyDay = useCallback(async (copyDay, toCopy) => {
    setCopyErrorHappened(false);
    setCopying(true);
    try {
      const dayInfo = await searchDayInfo(copyDay, observatory);
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
    } catch (error) {
      console.error(error);
      setCopyErrorHappened(true);
    } finally {
      setCopying(false);
    }
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
    if (!initialFormData) {
      return false;
    }

    return objectsDiffer(formData, initialFormData);
  };

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {t("unexpectedError")}
      </Typography>
    );
  }

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
            <ObservationFormDrafts disabled={loading || saving || copying || toDayDetailsLoading} draftID={draftID} onDraftSelect={handleDraftSelect} />
            <ObservationFormCopy disabled={loading || saving || copying || toDayDetailsLoading} day={formData.day} onCopyDay={handleCopyDay} />
          </Grid>
        </Grid>
        <ObservationFormMain
          formData={formData}
          disabled={loading || saving || copying || toDayDetailsLoading}
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
        <Snackbar open={copyErrorHappened} autoHideDuration={5000} onClose={handleAlertClose}>
          <Alert onClose={handleAlertClose} severity="error">
            {t("copyDayFailed")}
          </Alert>
        </Snackbar>
      </fieldset>
    </LoadingSpinner>
  );
};

ObservationForm.propTypes = {
  onSaveSuccess: PropTypes.func.isRequired
};
