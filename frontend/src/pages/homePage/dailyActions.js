import React from "react";
import {
  Grid, NativeSelect, FormControlLabel, Checkbox, FormGroup
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

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

const HankoActions = ({
  vakiohav,
  setVakiohav,
  attachments,
  setAttachments,
  gåu,
  setGåu,
  owl,
  setOwl,
  ringing,
  setRinging,
  mammals,
  setMammals
}) => {

  const classes = useStyles();
  const { t } = useTranslation();

  const handleVakiohavClick = () => {
    setVakiohav(!vakiohav);
  };

  const handleGåuClick = () => {
    setGåu(!gåu);
  };

  const handleRingingClick = () => {
    setRinging(!ringing);
  };

  const handleOwlClick = () => {
    setOwl(!owl);
  };

  const handleMammalClick = () => {
    setMammals(!mammals);
  };

  const chandleAttachments = (value) => {
    // usually 0-2, validations: must be int, 0 <= x < 5, or should be?
    setAttachments(value);
  };
  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={vakiohav} onChange={() => handleVakiohavClick()} name="vakioCheck" color="primary" />}
          label={t("Standard observation")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={gåu} onChange={() => handleGåuClick()} name="gåuCheck" color="primary" />}
          label={t("Gåu visited")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={ringing} onChange={() => handleRingingClick()} name="ringCheck" color="primary" />}
          label={t("Ringing standard")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={owl} onChange={() => handleOwlClick()} name="owlCheck" color="primary" />}
          label={t("Owl standard")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<Checkbox checked={mammals} onChange={() => handleMammalClick()} name="mammalCheck" color="primary" />}
          label={t("Mammals etc counted")} labelPlacement="end" />
        <FormControlLabel className={classes.formControlLabel}
          control={<NativeSelect className={classes.attachmentField} defaultValue={attachments} onChange={(event) => chandleAttachments(event.target.value)}>
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

HankoActions.propTypes = {
  vakiohav: PropTypes.bool.isRequired,
  setVakiohav: PropTypes.func.isRequired,
  attachments: PropTypes.number.isRequired,
  setAttachments: PropTypes.func.isRequired,
  gåu: PropTypes.bool.isRequired,
  setGåu: PropTypes.func.isRequired,
  owl: PropTypes.bool.isRequired,
  setOwl: PropTypes.func.isRequired,
  ringing: PropTypes.bool.isRequired,
  setRinging: PropTypes.func.isRequired,
  mammals: PropTypes.bool.isRequired,
  setMammals: PropTypes.func.isRequired
};

export default HankoActions;