import React, {
  useContext,
  useState, useCallback, useEffect
} from "react";
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary, AccordionDetails, Button, CircularProgress
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import CodeMirrorBlock from "../../../globalComponents/codemirror/CodeMirrorBlock";
import DailyActions from "../../../globalComponents/dayComponents/dailyActions";
import { AppContext } from "../../../AppContext";
import DayPicker from "../../../globalComponents/formComponents/DayPicker";
import Help from "../../../globalComponents/Help";
import Select from "../../../globalComponents/formComponents/Select";
import TextInput from "../../../globalComponents/formComponents/TextInput";
import CatchRows from "../../../globalComponents/dayComponents/catchRows";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
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
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  accordionRoot: {
    width: "100%",
  },
  sectionHeading: {
    fontSize: "20px",
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    opacity: "0.6",
  }
}
));


export const ObservationFormMain = ({
  formData, dayId, toDayDetailsLoading, saving, confirmDayChange, onToDayDetails, onSave, onFormDataChange
}) => {
  const classes = useStyles();

  const { t } = useTranslation();
  const { station } = useContext(AppContext);

  const notifications = useSelector(state => state.notifications);

  const [toDayDetailsDisabled, setToDayDetailsDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    setToDayDetailsDisabled(formData.observers.trim() === "" || !formData.day);
  }, [formData.observers, formData.day]);

  useEffect(() => {
    const { observers, type, location, shorthand } = formData;
    if (observers.trim() === "" || type === "" || location === "" || shorthand.trim() === "" || errorsInNotifications()) {
      setSaveDisabled(true);
    } else {
      setSaveDisabled(false);
    }
  }, [formData.observers, formData.type, formData.location, formData.shorthand, notifications]);

  const getUpdateFormData = (key) => useCallback((value) => {
    onFormDataChange((prevState) => ({ ...prevState, [key]: value }));
  }, []);

  const canChangeDay = useCallback(() => {
    if (!confirmDayChange) {
      return true;
    }
    return confirm(t("changeDateWhenObservationsConfirm"));
  }, [confirmDayChange]);

  const toDayDetails = () => {
    onToDayDetails(formData);
  };

  const sendData = () => {
    onSave(formData);
  };

  const errorsInNotifications = (category = "all") => {
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
  };

  return (
    <Grid container
      alignItems="flex-start"
      spacing={1}>
      <Grid item sm={3} background-color={"red"} style={{ minWidth: "150px" }}>
        <DayPicker
          value={formData.day}
          onChange={getUpdateFormData("day")}
          canChange={canChangeDay}
          required
        />
      </Grid>
      <Grid item sm={9}>
        <TextInput
          id="observers"
          label={t("observers")}
          value={formData.observers}
          onChange={getUpdateFormData("observers")}
          required
        />
      </Grid>
      <Grid item className={classes.buttonAndIconsContainer}>
        <Button
          id="toDayDetails"
          className={classes.sendButton}
          onClick={toDayDetails}
          disabled={toDayDetailsDisabled || toDayDetailsLoading}
          color="primary"
          variant="contained"
        >
          {t("toDayDetails")}
        </Button>
        <Help title={t("helpForToDayDetailsButton")} placement="right"/>
        { (toDayDetailsLoading) &&
          <CircularProgress className={classes.loadingIcon} color="primary"/>
        }
      </Grid>
      <div className={classes.accordionRoot}>
        <br />
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore color="primary" />}
            aria-controls="comment-content"
            id="comment-header"
          >
            <Typography className={classes.sectionHeading}>{t("comment")}</Typography>
            <Typography className={classes.secondaryHeading}>{formData.comment ? t("commentAdded") : t("noComment")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextInput
              rows={3}
              id="comment"
              label={t("comment")}
              onChange={getUpdateFormData("comment")}
              value={formData.comment}
            />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore color="primary" />}
            aria-controls="activity-content"
            id="activity-header"
          >
            <Typography className={classes.sectionHeading}>{t("ObservationActivity")}</Typography>

            <Typography className={classes.secondaryHeading} color={(errorsInNotifications("dailyactions")) ? "error" : "inherit"}>
              {
                (errorsInNotifications("dailyactions")) ? t("errorsInObservationActivity")
                  : (formData.dailyActions.attachments > "0" || Object.values(formData.dailyActions).includes(true)) ? t("observationActivityAdded")
                    : t("noObservationActivity")
              }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container
              alignItems="flex-start"
              spacing={1}
              style={{ marginLeft: 0 }}
            >
              <DailyActions value={formData.dailyActions} onChange={getUpdateFormData("dailyActions")} catchRows={formData.catchRows} />
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore color="primary" />}
            aria-controls="catches-content"
            id="catches-header"
          >
            <Typography className={classes.sectionHeading}>{t("catches")}</Typography>
            <Typography className={classes.secondaryHeading} color={(errorsInNotifications("catches")) ? "error" : "inherit"}>
              {
                (errorsInNotifications("catches")) ? t("errorsInCatches")
                  : (formData.catchRows.length === 0 || formData.catchRows[0].pyyntialue === "") ? t("noCatches")
                    : t("catchesAdded")
              }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CatchRows value={formData.catchRows} onChange={getUpdateFormData("catchRows")} />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMore color="primary" />}
            aria-controls="obervation-content"
            id="observation-header"
          >
            <Typography className={classes.sectionHeading}>{t("migrantObservations")} *</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container
              alignItems="flex-start"
              spacing={1}
            >
              <Grid item xs={3}>
                <Select
                  id="selectType"
                  label={t("type")}
                  options={station.types}
                  value={formData.type}
                  onChange={getUpdateFormData("type")}
                  required
                />
              </Grid>

              <Grid item xs={3}>
                <Select
                  id="selectLocation"
                  label={t("location")}
                  options={station.locations}
                  value={formData.location}
                  onChange={getUpdateFormData("location")}
                  required
                />
              </Grid>

              <Grid item xs={6}>
              </Grid>

              <Grid item xs={12}>
                <CodeMirrorBlock
                  value={formData.shorthand}
                  onChange={getUpdateFormData("shorthand")}
                  dayId={dayId}
                  day={formData.day}
                  type={formData.type}
                />
              </Grid>
            </Grid>

          </AccordionDetails>
        </Accordion>
      </div>
      <Grid item xs={12} className={classes.buttonAndIconsContainer}>
        <Button
          id="saveButton"
          className={classes.sendButton}
          onClick={sendData}
          disabled={saveDisabled || saving}
          color="primary"
          variant="contained"
        >
          {saving ? t("loading") : t("saveMigrant")}
        </Button>
        <Help title={t("helpForSaveMigrantButton")} placement="right"/>
        { (saving) &&
          <CircularProgress className={classes.loadingIcon} color="primary"/>
        }
      </Grid>
    </Grid>
  );
};

ObservationFormMain.propTypes = {
  formData: PropTypes.object.isRequired,
  dayId: PropTypes.number,
  toDayDetailsLoading: PropTypes.bool,
  saving: PropTypes.bool,
  confirmDayChange: PropTypes.bool,
  onToDayDetails: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onFormDataChange: PropTypes.func.isRequired
};
