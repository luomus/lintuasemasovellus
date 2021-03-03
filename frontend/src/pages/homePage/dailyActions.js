import React, { useState } from "react";
import {
  Grid, FormControlLabel, Checkbox, FormGroup, InputAdornment, TextField, Dialog,
  Button, DialogActions, DialogContentText, DialogContent
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

  const [error, setError] = useState("");
  const [confirmationAsked, setConfirmantionAsked] = useState(false);
  const [showModal, setshowModal] = useState(false);

  const handleModalClose = () => {
    setshowModal(false);
    setConfirmantionAsked(true);
  };

  const handleClick = (target) => {
    if (target.name === "liitteet" && target.value < 0) {
      setError(t("no negative values"));
    } else if (target.name === "liitteet" && !target.value) {
      setError(t("no empty values"));
    } else if (target.name === "liitteet" && target.value > 4 && !confirmationAsked) {
      setshowModal(true);
      setError("");
    } else {
      setError("");
      //setConfirmantionAsked(false);
    }

    //overwrite bad attachment input with 0
    // if (target.name==="liitteet" && (target.value ==="" || target.value < 0)) {
    //   dispatch(toggleDailyActions(target.name, 0));
    // }
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
          control={<TextField name="liitteet" type="number" className={classes.attachmentField} value={clicks.liitteet}
            onChange={(e) => handleClick(e.target)}
            error={error !== ""} helperText={error ? t(error) : ""}
            InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}>
          </TextField>}
          label={t("liitteet")} labelPlacement="start" />
      </FormGroup>
      <Dialog open={showModal} onClose={handleModalClose} disableBackdropClick={true}>
        <DialogContent>
          <DialogContentText id="confirmation dialog">
            {t("Please recheck that you mean to declare that many attachments")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>

  );
};


export default DailyActions;