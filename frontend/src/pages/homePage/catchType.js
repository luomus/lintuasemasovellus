import React from "react";
import {
  TextField, InputLabel, Select, MenuItem, FormControl,
  FormControlLabel, InputAdornment, Grid, FormGroup
} from "@material-ui/core/";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { toggleCatchDetails } from "../../reducers/catchRowsReducer";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100,
  },
  formControlLabel: {
    padding: "0px 30px 0px 0px",
    margin: theme.spacing(1),
  },
  formControlLabel2: {
    padding: "0px 30px 0px 0px",
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  netCodes: {
    width: 110,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 75,
  },
}
));

const catchTypes = ["Vakioverkko",
  "Lisäverkko",
  "Petoverkot",
  "Rastasverkko",
  "Katiska",
  "Lokkihäkki",];

const catchAreas = {
  "Vakioverkko": ["Vakioverkot K", "Vakioverkot muu"],
  "Lisäverkko": ["Piha", "Gåu", "Kärjen ruovikko", "Muu"],
  "Petoverkot": ["Vakiopetoverkot", "Muut petoverkot"],
  "Rastasverkko": ["Piha", "Gåu", "Muu"],
  "Katiska": ["Gåu", "Kallskär", "Muu"],
  "Lokkihäkki": ["Gåu", "Kallskär", "Muu"],
  "": [""]
};

//const maxNumbers = {
//  "Vakioverkko": 11,
//  "Lisäverkko": 9,
//  "Petoverkot": 12,
//  "Rastasverkko": 9,
//  "Katiska": 12,
//  "Lokkihäkki": 12,
//  "": ""
//};


const CatchType = ({ cr }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = (target) => {
    console.log("click", target);
    dispatch(toggleCatchDetails(cr.key, target.name, target.value));
  };

  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <FormControlLabel className={classes.formControlLabel}
          control={<FormControl className={classes.formControl}>
            <InputLabel id="Pyydys">{t("catchType")}</InputLabel>
            <Select
              required
              labelId="catchType"
              id="selectCatchType"
              name="pyydys"
              value={cr.pyydys}
              onChange={(event) => handleChange(event.target)}
            >
              {
                catchTypes.map((catchType, i) =>
                  <MenuItem id={catchType} value={catchType} key={i}>
                    {catchType}
                  </MenuItem>
                )
              }</Select>
          </FormControl>
          } />
        <FormControlLabel className={classes.formControlLabel}
          control={<FormControl className={classes.formControl}>
            <InputLabel id="Pyyntialue">{t("catchArea")}</InputLabel>
            <Select
              required
              labelId="catchArea"
              id="selectCatchArea"
              name="pyyntialue"
              value={cr.pyyntialue}
              onChange={(event) => handleChange(event.target)}
            >
              {
                catchAreas[String(cr.pyydys)].map((cArea, i) =>
                  <MenuItem id={cArea} value={cArea} key={i}>
                    {cArea}
                  </MenuItem>
                )
              }</Select>
          </FormControl>} />

        <FormControl className={classes.formControlLabel}>
          <TextField required
            className={classes.netCodes}
            id="netCodes"
            name="verkkokoodit"
            label={t("netCodes")}
            onChange={(event) => handleChange(event.target)}
            value={cr.verkkokoodit}
          />
        </FormControl>
        <FormControlLabel className={classes.formControlLabel2}
          label={t("catchCount")} labelPlacement="start"
          control={
            <TextField
              className={classes.textField}
              id="selectCatchCount"
              name="lukumaara"
              required
              type="number"
              value={cr.lukumaara}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}
            />
          } />
        <FormControlLabel className={classes.formControlLabel2}
          label={t("netLength")} labelPlacement="start"
          control={<TextField
            className={classes.textField}
            id="selectNetLength"
            required
            name="verkonPituus"
            type="number"
            value={cr.verkonPituus}
            onChange={(event) => handleChange(event.target)}
            InputProps={{ endAdornment: <InputAdornment position="end">{"m"}</InputAdornment>, inputProps: { min: 0 } }}
          />

          } />
        <FormControlLabel className={classes.formControlLabel2}
          label={t("netopened")} labelPlacement="start"
          control={<TextField
            id="opened"
            type="time"
            defaultValue={cr.alku}
            name="alku"
            onChange={(event) => handleChange(event.target)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 60,
            }}
          />} />

        <FormControlLabel className={classes.formControlLabel2}
          label={t("netclosed") } labelPlacement="start"
          control={<TextField
            id="closed"
            type="time"
            name="loppu"
            defaultValue={cr.loppu}
            onChange={(event) => handleChange(event.target)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 60,
            }}
          />} />
      </FormGroup>
    </Grid>

  );
};

CatchType.propTypes = {
  cr: PropTypes.object.isRequired,
};

export default CatchType;