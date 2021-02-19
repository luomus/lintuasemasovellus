import React from "react";
import {
  Grid, NativeSelect, FormControlLabel, Checkbox, FormGroup
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { toggleDailyActions } from "../../reducers/dailyActionsReducer";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  formControlLabel: {
    padding: "0px 100px 0px 0px",
  },
  attachmentField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 75,
  },
}
));

const DailyActions = () => {
  const userObservatory = useSelector(state => state.userObservatory);
  if (userObservatory === "Hangon_Lintuasema") {
    //console.log("toimii");
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

  const handleClick = (target) => {
    dispatch(toggleDailyActions(target.name, target.name === "liitteet" ? target.value : target.checked));
    //console.log("clicks", clicks);
  };

  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.vakiohavainto} onChange={(e) => handleClick(e.target)} name="vakiohavainto" color="primary" />}
          label={t("vakiohavainto")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.gåu} onChange={(e) => handleClick(e.target)} name="gåu" color="primary" />}
          label={t("gåu")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.rengastusvakio} onChange={(e) => handleClick(e.target)} name="rengastusvakio" color="primary" />}
          label={t("rengastusvakio")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.pöllövakio} onChange={(e) => handleClick(e.target)} name="pöllövakio" color="primary" />}
          label={t("pöllövakio")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.nisäkkäät} onChange={(e) => handleClick(e.target)} name="nisäkkäät" color="primary" />}
          label={t("nisäkkäät")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<NativeSelect name="liitteet" className={classes.attachmentField} value={clicks.liitteet} onChange={(e) => handleClick(e.target)}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </NativeSelect>}
          label={t("liitteet")} labelPlacement="start" />
      </FormGroup>
    </Grid>
  );
};


export default DailyActions;