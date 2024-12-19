import React, { useContext } from "react";
import {
  Grid, FormControlLabel, Checkbox, FormGroup, InputAdornment, TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { toggleDailyActions } from "../../reducers/dailyActionsReducer";
import { setNotifications } from "../../reducers/notificationsReducer";
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
  const clicks = useSelector(state => state.dailyActions);
  const allCatchRows = useSelector(state => state.catchRows);

  const validate = (target) => {
    let toNotifications = [];
    let toErrors = [];

    //things for user to doublecheck
    if (target.name === "attachments" && target.value > 4) {
      toNotifications.push(t("recheckLargeNumberOfAttachments"));
    }
    //errors, prevent saving
    if (target.name === "attachments" && target.value < 0){
      toErrors.push(t("noNegativeValues"));
    }
    if (target.name === "attachments" && !target.value){
      toErrors.push(t("noEmptyValues"));
    }
    if (target.name === "standardRing") {
      if (target.checked) {
        let standardCatch = false;
        Object.keys(allCatchRows).map((c) => {
          if (allCatchRows[String(c)].pyydys === "Vakioverkko") {
            standardCatch = true;
          }
        });
        if (!standardCatch) {
          dispatch(setNotifications([[], [t("expectingStandardCatch")]], "catches", 0));
        }
        else {
          dispatch(setNotifications([[], []], "catches", 0));
        }
      } else {
        dispatch(setNotifications([[], []], "catches", 0));
      }
    }

    return [toNotifications, toErrors];
  };

  const handleChange = (target) => {
    dispatch(toggleDailyActions(target.name, target.name === "attachments" ? target.value : target.checked));
    //run validations on change
    const result = validate(target);
    dispatch(setNotifications([result[0], result[1]], "dailyactions", target.name));
  };

  return (
    <Grid container
      alignItems="flex-start"
      spacing={1}
    >
      <Notification category="dailyactions" />
      <Grid item xs={12} >
        <FormGroup row className={classes.formGroup} >
          <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={clicks.standardObs} onChange={(event) => handleChange(event.target)} name="standardObs" color="primary" className={classes.checkbox} />}
            label={t("standardObs")} labelPlacement="end" />
          <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={clicks.gåu} onChange={(event) => handleChange(event.target)} name="gåu" color="primary" className={classes.checkbox} />}
            label={t("gåu")} labelPlacement="end" />
          <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={clicks.standardRing} onChange={(event) => handleChange(event.target)} name="standardRing" color="primary" className={classes.checkbox} />}
            label={t("standardRing")} labelPlacement="end" />
          <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={clicks.owlStandard} onChange={(event) => handleChange(event.target)} name="owlStandard" color="primary" className={classes.checkbox} />}
            label={t("owlStandard")} labelPlacement="end" />
          <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={clicks.mammals} onChange={(event) => handleChange(event.target)} name="mammals" color="primary" className={classes.checkbox} />}
            label={t("mammals")} labelPlacement="end" />
          <FormControlLabel className={classes.formControlLabel}
            control={<TextField name="attachments" id="attachments" type="number" className={classes.attachmentField} value={clicks.attachments}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}>
            </TextField>}
            label={t("attachments")} labelPlacement="start" />
        </FormGroup>
      </Grid>
    </Grid>
  );
};


export default DailyActions;
