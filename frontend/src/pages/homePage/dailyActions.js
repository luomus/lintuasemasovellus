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

  //const initialState= { vakiohavainto:false, gåu:false, rengastusvakio:false, pöllövakio:false,nisäkkäät:false,liitteet: 0 };

  const clicks = useSelector(state => state.dailyActions);
  //console.log("clicks", clicks);
  // if (Object.entries(clicks).length === 0 ){
  //   console.log("Luodaan");
  //   dispatch(setDailyActions(initialState));
  // }

  const handleClick = (target) => {
    dispatch(toggleDailyActions(target.name, target.name === "liitteet" ? target.value : target.checked));
    //console.log("clicks", clicks);
  };


  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.vakiohavainto} onChange={(e) => handleClick(e.target)} name="vakiohavainto" color="primary" />}
          label={t("Standard observation")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.gåu} onChange={(e) => handleClick(e.target)} name="gåu" color="primary" />}
          label={t("Gåu visited")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.rengastusvakio} onChange={(e) => handleClick(e.target)} name="rengastusvakio" color="primary" />}
          label={t("Ringing standard")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.pöllövakio} onChange={(e) => handleClick(e.target)} name="pöllövakio" color="primary" />}
          label={t("Owl standard")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.nisäkkäät} onChange={(e) => handleClick(e.target)} name="nisäkkäät" color="primary" />}
          label={t("Mammals etc counted")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<NativeSelect name="liitteet" className={classes.attachmentField} defaultValue={clicks.liitteet} onChange={(e) => handleClick(e.target)}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </NativeSelect>}
          label={t("Attachments")} labelPlacement="start" />
      </FormGroup>
    </Grid>
  );
};


export default DailyActions;