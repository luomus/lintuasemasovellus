import React, { memo, useContext, useEffect } from "react";
import {
  Grid, FormControlLabel, Checkbox, FormGroup, InputAdornment, TextField
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import {  useDispatch } from "react-redux";
import { setNotifications } from "../../reducers/notificationsReducer";
import Notification from "../Notification";
import { AppContext } from "../../AppContext";
import PropTypes from "prop-types";

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

const DailyActions = ({ value, onChange, catchRows }) => {
  const { observatory } = useContext(AppContext);
  if (observatory === "Hangon_Lintuasema") {
    return (
      <HankoActions value={value} onChange={onChange} catchRows={catchRows} />
    );
  }
  return (
    <div>
    </div>
  );
};

const HankoActions = ({ value, onChange, catchRows }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    Object.entries(value).forEach(([key, value]) => {
      if (key === "attachments") {
        const result = validateAttachments(value);
        dispatch(setNotifications([result[0], result[1]], "dailyactions", key));
      }
    });
  }, [value]);

  useEffect(() => {
    updateStandardCatchNotification();
  }, [value, catchRows]);

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

    if (value.standardRing) {
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
    onChange({ ...value, [target.name]: target.name === "attachments" ? target.value : target.checked });
  };

  return (
    <Grid container
      alignItems="flex-start"
      spacing={1}
    >
      <Notification category="dailyactions" />
      <Grid item xs={12} >
        <FormGroup row className={classes.formGroup} >
          { value.standardObs !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={value.standardObs} onChange={(event) => handleChange(event.target)} name="standardObs" color="primary" className={classes.checkbox} />}
            label={t("standardObs")} labelPlacement="end" /> }
          { value.gåu !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={value.gåu} onChange={(event) => handleChange(event.target)} name="gåu" color="primary" className={classes.checkbox} />}
            label={t("gåu")} labelPlacement="end" /> }
          { value.standardRing !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={value.standardRing} onChange={(event) => handleChange(event.target)} name="standardRing" color="primary" className={classes.checkbox} />}
            label={t("standardRing")} labelPlacement="end" /> }
          { value.owlStandard !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={value.owlStandard} onChange={(event) => handleChange(event.target)} name="owlStandard" color="primary" className={classes.checkbox} />}
            label={t("owlStandard")} labelPlacement="end" /> }
          { value.mammals !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<Checkbox checked={value.mammals} onChange={(event) => handleChange(event.target)} name="mammals" color="primary" className={classes.checkbox} />}
            label={t("mammals")} labelPlacement="end" /> }
          { value.attachments !== undefined && <FormControlLabel className={classes.formControlLabel}
            control={<TextField name="attachments" id="attachments" type="number" className={classes.attachmentField} value={value.attachments}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}>
            </TextField>}
            label={t("attachments")} labelPlacement="start" /> }
        </FormGroup>
      </Grid>
    </Grid>
  );
};

DailyActions.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  catchRows: PropTypes.arrayOf(PropTypes.object).isRequired
};

HankoActions.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  catchRows: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(DailyActions);
