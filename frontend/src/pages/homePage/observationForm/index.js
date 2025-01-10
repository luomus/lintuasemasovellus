import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, CircularProgress, Grid, Snackbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Alert from "../../../globalComponents/Alert";
import { loopThroughObservationPeriods, loopThroughObservations, } from "../../../shorthand/parseShorthandField";
import { searchDayInfo, sendDay, sendEverything } from "../../../services";
import { refreshDays } from "../../../reducers/daysReducer";
import { setDailyActions, setDefaultActions } from "../../../reducers/formDataReducer/dailyActionsReducer";
import { setCatches } from "../../../reducers/formDataReducer/catchRowsReducer";
import { resetNotifications } from "../../../reducers/notificationsReducer";
import Help from "../../../globalComponents/Help";
import { addDraft, deleteDraft } from "../../../services/draftService";
import { ObservationFormHeader } from "./ObservationFormHeader";
import { ObservationFormMainSection } from "./ObservationFormMainSection";
import { ObservationFormDrafts } from "./ObservationFormDrafts";
import { ObservationFormCopy } from "./ObservationFormCopy";
import LoadingSpinner from "../../../globalComponents/LoadingSpinner";
import { AppContext } from "../../../AppContext";
import {
  emptyShorthand,
  setInitialFormData, updateFormDataWithDayData
} from "../../../reducers/formDataReducer/formDataReducer";
import { loopThroughCheckForErrors } from "../../../shorthand/newValidations";
import { setBaseFormData } from "../../../reducers/formDataReducer/baseFormDataReducer";
import { dateToDayString } from "../../../services";

const useStyles = makeStyles(() => ({
  fieldsContainer: {
    border: "none",
    padding: 0,
    margin: 0
  },
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

export const ObservationForm = ({ onSaveSuccess }) => {
  const classes = useStyles();

  const { t } = useTranslation();
  // const confirmBrowserExit = useConfirmBrowserExit();
  const { user, observatory } = useContext(AppContext);

  const dayList = useSelector(state => state.days);
  const formData = useSelector(state => state.formData);
  const notifications = useSelector(state => state.notifications);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [saveLoadingIcon, setSaveLoadingIcon] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [errorHappened, setErrorHappened] = useState(false);
  const [draftID, setDraftID] = useState();
  //const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    dispatch(refreshDays());
    dispatch(resetNotifications());
    initFormData(dateToDayString(new Date())).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    dispatch(resetNotifications());
    updateFormDataDay(formData.baseData.day).then(() => {
      setLoading(false);
    });
  }, [formData.baseData.day]);

  /*useEffect(() => {
    if (hasChanges) {
      confirmBrowserExit.enable();
    } else {
      confirmBrowserExit.disable();
    }
  }, [hasChanges]);*/

  useEffect(() => {
    const { day, observers, comment, type, location, shorthand } = formData.baseData;

    if (!type && !location && !shorthand) return;
    let data = {
      day,
      comment,
      observers,
      observatory: observatory,
      selectedactions: stringifyDailyActions(),
      userID: user.id,
      type,
      location,
      shorthand: shorthand,
      catchRows: JSON.stringify(formData.catchRows),
    };
    if (draftID === undefined) {
      addDraft(data).then(r => {
        setDraftID(r);
      });
    } else {
      addDraft({ ...data, id: draftID });
    }
  }, [formData]);

  const initFormData = async (day) => {
    const dayJson = await searchDayInfo(day, observatory);
    await dispatch(setInitialFormData(day, observatory, dayJson[0]));
  };

  const updateFormDataDay = async (day) => {
    if (day) {
      const dayJson = await searchDayInfo(day, observatory);
      await dispatch(updateFormDataWithDayData(day, observatory, dayJson[0]));
    } else {
      await dispatch(updateFormDataWithDayData(day, observatory, {}));
    }
  };

  const stringifyDailyActions = () => {
    if ("attachments" in formData.dailyActions) {
      if (formData.dailyActions.attachments === "" || formData.dailyActions.attachments < 0) {
        return JSON.stringify({ ...formData.dailyActions, "attachments": 0 });
      }
    }
    return JSON.stringify(formData.dailyActions);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setFormSent(false);
    setErrorHappened(false);
  };

  const sendData = async () => {
    const { day, observers, comment, type, location } = formData.baseData;

    setSaveLoadingIcon(true);
    const rows = loopThroughCheckForErrors(formData.baseData.shorthand);
    const observationPeriodsToSend = loopThroughObservationPeriods(rows, type, location);
    const observationsToSend = loopThroughObservations(rows, user.id);
    setSaveDisabled(true);
    let data = {
      day,
      comment: comment,
      observers: observers,
      observatory: observatory,
      selectedactions: stringifyDailyActions(),
      userID: user.id,
      catches: formData.catchRows,
      observationPeriods: observationPeriodsToSend,
      observations: observationsToSend
    };

    try {
      await sendEverything(data);
      setFormSent(true);
      dispatch(emptyShorthand());
      dispatch(refreshDays());
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
    const { day, observers } = formData.baseData;

    try {
      const searchResult = await searchDayInfo(day, observatory);
      //Update if observers is changed
      if (searchResult[0].observers !== observers) {
        const data = {
          day,
          observers: observers,
          observatory: observatory,
          comment: searchResult[0].comment,
          selectedactions: searchResult[0].selectedactions === ""
            ? JSON.stringify(dispatch(setDefaultActions(observatory)).data.dailyActions)
            : searchResult[0].selectedactions
        };
        await sendDay(data);
      }
      navigate(`/daydetails/${day}`);
    } catch (error) {
      console.error(error.message);
      setErrorHappened(true);
    }
  };

  const saveButtonDisabled = () => {
    const { observers, type, location, shorthand } = formData.baseData;
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
    searchDayInfo(copyDay, observatory).then((dayJson) => {
      if (dayJson[0]["id"] !== 0) {
        const copyData = {};
        if (toCopy.observers) {
          copyData["observers"] = dayJson[0]["observers"];
        }
        if (toCopy.comment) {
          copyData["comment"] = dayJson[0]["comment"];
        }
        if (toCopy.observationActivity) {
          copyData["selectedactions"] = dayJson[0]["selectedactions"];
        }
        if (toCopy.catches) {
          copyData["id"] = dayJson[0]["id"];
        }
        setInitialFormData(formData.day, observatory, copyData);
        dispatch(resetNotifications());
      }
    });
  };

  const handleDraftSelect = (el) => {
    setDraftID(undefined);
    dispatch(setBaseFormData({ ...formData.baseData, ...el }));
    if (el.selectedactions) {
      dispatch(setDailyActions(JSON.parse(el.selectedactions)));
    } else {
      dispatch(setDefaultActions(observatory));
    }
    dispatch(setCatches(JSON.parse(el.catchRows)));
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
            <ObservationFormCopy onCopyDay={handleCopyDay} />
          </Grid>
          <ObservationFormHeader
            confirmDateChange={!(formData.catchRows.length === 0 && formData.baseData.observers === "" && formData.baseData.comment === "")}
            toDayDetails={handleToDayDetails}
          />
          <ObservationFormMainSection
            dayList={dayList}
            errorsInInput={errorsInInput}
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
      </fieldset>
    </LoadingSpinner>
  );
};

ObservationForm.propTypes = {
  onSaveSuccess: PropTypes.func.isRequired
};
