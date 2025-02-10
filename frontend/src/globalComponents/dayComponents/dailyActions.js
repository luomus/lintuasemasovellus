import React, { useContext, useEffect } from "react";
import {
  Grid, FormControlLabel, Checkbox, FormGroup, InputAdornment, TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { toggleDailyActions } from "../../reducers/formDataReducer/dailyActionsReducer";
import { setNotifications } from "../../reducers/formStateReducer/notificationsReducer";
import Notification from "../Notification";
import { AppContext } from "../../AppContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  formControlLabel: {
    padding: "0px 60px 0px 0px",
  },
  attachmentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 90,
  },
  checkbox: {
    color: theme.palette.primary.main,
  }
}
));

const DailyActions = () => {
  const { observatory } = useContext(AppContext);
  if (observatory === "Hangon_Lintuasema") {
    return (
      <HankoActions />
    );
  }
  return (
    <div>
    </div>
  );
};

const HankoActions = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  const dailyActions = useSelector(state => state.formData.dailyActions);
  const catchRows = useSelector(state => state.formData.catchRows);

  useEffect(() => {
    Object.entries(dailyActions).forEach(([key, value]) => {
      if (key === "attachments") {
        const result = validateAttachments(value);
        dispatch(setNotifications([result[0], result[1]], "dailyactions", key));
      }
    });
  }, [dailyActions]);

  useEffect(() => {
    updateStandardCatchNotification();
  }, [dailyActions, catchRows]);

  const validateAttachments = (value) => {
    const toNotifications = [];
    const toErrors = [];

    if (value > 4) {
      toNotifications.push(t("recheckLargeNumberOfAttachments"));
    }
    if (value < 0){
      toErrors.push(t("noNegativeValues"));
    }
    if (!value) {
      toErrors.push(t("noEmptyValues"));
    }

    return [toNotifications, toErrors];
  };

  const updateStandardCatchNotification = () => {
    const toErrors = [];

    if (dailyActions.standardRing) {
      let standardCatch = false;
      Object.keys(catchRows).map((c) => {
        if (catchRows[String(c)].pyydys === "Vakioverkko") {
          standardCatch = true;
        }
      });
      if (!standardCatch) {
        toErrors.push(t("expectingStandardCatch"));
      }
    }

    dispatch(setNotifications([[], toErrors], "catches", "standardCatch"));
  };

  const handleChange = (target) => {
    dispatch(toggleDailyActions(target.name, target.name === "attachments" ? target.value : target.checked));
  };

  return (
    <Grid container
      alignItems="flex-start"
      spacing={1}
    >
      <Notification category="dailyactions" />
      <Grid item xs={12} >
        <FormGroup row className={classes.formGroup} >
          { dailyActions.standardObs !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={dailyActions.standardObs} onChange={(event) => handleChange(event.target)} name="standardObs" color="primary" className={classes.checkbox} />}
            label={t("standardObs")} labelPlacement="end" /> }
          { dailyActions.gåu !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={dailyActions.gåu} onChange={(event) => handleChange(event.target)} name="gåu" color="primary" className={classes.checkbox} />}
            label={t("gåu")} labelPlacement="end" /> }
          { dailyActions.standardRing !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={dailyActions.standardRing} onChange={(event) => handleChange(event.target)} name="standardRing" color="primary" className={classes.checkbox} />}
            label={t("standardRing")} labelPlacement="end" /> }
          { dailyActions.owlStandard !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={dailyActions.owlStandard} onChange={(event) => handleChange(event.target)} name="owlStandard" color="primary" className={classes.checkbox} />}
            label={t("owlStandard")} labelPlacement="end" /> }
          { dailyActions.mammals !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={dailyActions.mammals} onChange={(event) => handleChange(event.target)} name="mammals" color="primary" className={classes.checkbox} />}
            label={t("mammals")} labelPlacement="end" /> }
          { dailyActions.attachments !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<TextField name="attachments" id="attachments" type="number" className={classes.attachmentField} value={dailyActions.attachments}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}>
            </TextField>}
            label={t("attachments")} labelPlacement="start" /> }
        </FormGroup>
      </Grid>
    </Grid>
  );
};


export default DailyActions;
