import React, { useState } from "react";
import {
  TextField, InputLabel, Select, MenuItem, FormControl,
  FormControlLabel, InputAdornment, Grid, FormGroup
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";

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


const CatchType = () => {
  const [catchType, setCatchType] = useState("");
  const [netCodes, setNetCodes] = useState("");
  const [catchCount, setCatchCount] = useState(0);
  const [catchArea, setCatchArea] = useState("");
  const [netLength, setNetLength] = useState(0);
  const { t } = useTranslation();
  const classes = useStyles();

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
              value={catchType}
              onChange={(event) => setCatchType(event.target.value)}
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
              value={catchArea}
              onChange={(event) => setCatchArea(event.target.value)}
            >
              {
                catchAreas[String(catchType)].map((cArea, i) =>
                  <MenuItem id={catchArea} value={cArea} key={i}>
                    {cArea}
                  </MenuItem>
                )
              }</Select>
          </FormControl>} />

        <FormControl className={classes.formControlLabel}>
          <TextField required
            className={classes.netCodes}
            id="netCodes"
            label={t("netCodes")}
            onChange={(event) => setNetCodes(event.target.value)}
            value={netCodes}
          />
        </FormControl>
        <FormControlLabel className={classes.formControlLabel2}
          label={t("catchCount")} labelPlacement="start"
          control={
            <TextField
              className={classes.textField}
              id="selectCatchCount"
              required
              type="number"
              labelId="catchCount"
              value={catchCount}
              onChange={(event) => setCatchCount(event.target.value)}
              InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}
            />
          } />
        <FormControlLabel className={classes.formControlLabel2}
          label={t("netLength")} labelPlacement="start"
          control={<TextField
            className={classes.textField}
            id="selectNetLength"
            required
            type="number"
            labelId="netLength"
            value={netLength}
            onChange={(event) => setNetLength(event.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">{"m"}</InputAdornment>, inputProps: { min: 0 } }}
          />

          } />
      </FormGroup>
    </Grid>

  );
};

export default CatchType;