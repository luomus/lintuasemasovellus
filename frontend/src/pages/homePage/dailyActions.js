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
    if (target.name === "attachments" && target.value < 0) {
      setError(t("valueIsNegative"));
    } else if (target.name === "attachments" && !target.value) {
      setError(t("no empty values"));
    } else if (target.name === "attachments" && target.value > 4 && !confirmationAsked) {
      setshowModal(true);
      setError("");
    } else {
      setError("");
      //setConfirmantionAsked(false);
    }
    dispatch(toggleDailyActions(target.name, target.name === "attachments" ? target.value : target.checked));
    //console.log("clicks", clicks);
  };

  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.standardObs} onChange={(e) => handleClick(e.target)} name="standardObs" color="primary" />}
          label={t("standardObs")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.gåu} onChange={(e) => handleClick(e.target)} name="gåu" color="primary" />}
          label={t("gåu")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.standardRing} onChange={(e) => handleClick(e.target)} name="standardRing" color="primary" />}
          label={t("standardRing")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.owlStandard} onChange={(e) => handleClick(e.target)} name="owlStandard" color="primary" />}
          label={t("owlStandard")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={clicks.mammals} onChange={(e) => handleClick(e.target)} name="mammals" color="primary" />}
          label={t("mammals")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<TextField name="attachments" id="attachments" type="number" className={classes.attachmentField} value={clicks.attachments}
            onChange={(e) => handleClick(e.target)}
            error={error !== ""} helperText={error ? t(error) : ""}
            InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}>
          </TextField>}
          label={t("attachments")} labelPlacement="start" />
      </FormGroup>
      <Dialog open={showModal} onClose={handleModalClose} disableBackdropClick={true}>
        <DialogContent>
          <DialogContentText id="confirmation dialog">
            {t("recheckLargeNumberOfAttachments")}
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