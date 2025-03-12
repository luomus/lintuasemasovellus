import React, { useEffect, memo } from "react";
import { HighlightOff } from "@mui/icons-material";
import {
  TextField, MenuItem, InputAdornment, Grid, FormGroup, IconButton,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { setNotifications } from "../../reducers/notificationsReducer";


const useStyles = makeStyles((theme) => ({
  inputField: {
    flex: "4 1 0",
    margin: theme.spacing(1),
    minWidth: 100,
    maxWidth: 200
  },
  smallInputField: {
    flex: "1 1 0",
    margin: theme.spacing(1),
    minWidth: 75,
    maxWidth: 100
  },
  removeButton: {
    margin: theme.spacing(1)
  }
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


const softAmountLimits = {
  "Lisäverkko": { "Piha": 9 },
  "Petoverkot": { "Vakiopetoverkot": 8 },
};

const hardAmountLimits = {
  "Vakioverkot K": 1,
  "Vakioverkot muu": 11
};

const catchesWithoutLength = ["Katiska", "Lokkihäkki"];

const preSetLengths = {
  "Vakioverkot muu": 9,
  "Vakioverkot K": 12,
  "Piha": 9,
  "Vakiopetoverkot": 12,
  "Muut petoverkot": 12,
};

const CatchRow = ({ value, onChange, onDelete, catchRows }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const result = validate(value);
    dispatch(setNotifications([result[0], result[1]], "catches", value.key));
  }, [value, catchRows]);

  const validate = (cr) => {
    let toNotifications = [];
    let toErrors = [];

    //things for user to doublecheck
    if ((cr.pyydys in softAmountLimits && cr.pyyntialue in softAmountLimits[String(cr.pyydys)] && cr.lukumaara > softAmountLimits[String(cr.pyydys)][String(cr.pyyntialue)]) || cr.lukumaara > 15) {
      toNotifications.push(t("checkNumberOfCatches", { char: cr.pyydys }));
    }
    if (cr.pyydys && cr.pyyntialue && catchAreas[String(cr.pyydys)].includes(cr.pyyntialue)
      && !catchesWithoutLength.includes(cr.pyydys) && (cr.verkonPituus < 9 || cr.verkonPituus > 12)) {
      toNotifications.push(t("checkNetLength", { char: cr.pyydys }));
    }

    //errors, prevent saving
    if (cr.lukumaara < 0 || cr.verkonPituus < 0) {
      toErrors.push(t("noNegativeValues"));
    }
    if (cr.pyydys && !cr.pyyntialue) {
      toErrors.push(t("noCatchArea"));
    }
    if (cr.alku !== "00:00" && cr.loppu !== "00:00") {
      if (cr.alku.slice(0, 2) > cr.loppu.slice(0, 2) || (cr.alku.slice(0, 2) === cr.loppu.slice(0, 2) && cr.alku.slice(3, 5) > cr.loppu.slice(3, 5)))
        toErrors.push(t("closeBeforeOpen", { char: cr.pyydys }));
    }
    if (cr.pyydys && cr.pyyntialue && cr.lukumaara === "0") {
      toErrors.push(t("noZeroAmount", { char: cr.pyydys }));
    }
    if ((cr.pyyntialue in hardAmountLimits && cr.lukumaara > hardAmountLimits[String(cr.pyyntialue)])) {
      toErrors.push(t("maxCatchValue", { char1: cr.pyyntialue, char2: hardAmountLimits[String(cr.pyyntialue)] }));
    }
    if (cr.pyydys && cr.pyyntialue) {
      for (let c of Object.keys(catchRows)) {
        if (catchRows[String(c)].key !== cr.key && catchRows[String(c)].pyydys === cr.pyydys && catchRows[String(c)].pyyntialue === cr.pyyntialue && catchRows[String(c)].alku === cr.alku && catchRows[String(c)].loppu === cr.loppu) {
          toErrors.push(t("duplicateCatches", { char: cr.pyyntialue }));
          break;
        }
      }
    }

    return [toNotifications, toErrors];
  };

  const handleChange = (target) => {
    const newValue = { ...value };

    if (target.name === "pyydys") {
      //rechoosing catchType, empty area to prevent previous options are from persisting
      newValue["pyyntialue"] = "";
      newValue["lukumaara"] = 0;
    }
    if (target.name === "pyyntialue") {
      //catch actively clicked, set amount to minumn,
      newValue["lukumaara"] = 1;
    }

    if (target.name === "pyyntialue" && !catchesWithoutLength.includes(value.pyydys)) {//cr.pyydys !== "Rastasverkko") {
      //autofill length for nets that are always the same length
      if (target.value in preSetLengths) {
        newValue["verkonPituus"] = preSetLengths[String(target.value)];
      } else {
        newValue["verkonPituus"] = 9;
      }
    } else if (target.name === "pyydys" && value.verkonPituus !== 0) {
      //remove previous length autofill, when catch changes
      newValue["verkonPituus"] = 0;
    }
    onChange({ ...newValue, [target.name]: target.value });
  };

  const handleRowRemove = () => {
    onDelete();
    dispatch(setNotifications([[], []], "catches", value.key));
  };

  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <TextField
          required
          select
          className={classes.inputField}
          label={t("catchType")}
          id="selectCatchType"
          name="pyydys"
          slotProps={{
            select: {
              value: value.pyydys,
              onChange: (event) => handleChange(event.target)
            }
          }}
        >
          {
            catchTypes.map((catchType, i) =>
              <MenuItem id={catchType} value={catchType} key={i}>
                {catchType}
              </MenuItem>
            )
          }
        </TextField>
        <TextField
          required
          select
          className={classes.inputField}
          label={t("catchArea")}
          id="selectCatchArea"
          name="pyyntialue"
          slotProps={{
            select: {
              value: value.pyyntialue,
              onChange: (event) => handleChange(event.target)
            }
          }}
        >
          {
            catchAreas[String(value.pyydys)].map((cArea, i) =>
              <MenuItem id={cArea} value={cArea} key={i}>
                {cArea}
              </MenuItem>
            )
          }
        </TextField>

        {(value.pyydys === "" || value.pyyntialue === "" || !catchAreas[String(value.pyydys)].includes(value.pyyntialue))
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            id="opened"
            type="time"
            className={classes.smallInputField}
            label={t("netopened")}
            defaultValue={value.alku}
            name="alku"
            onChange={(event) => handleChange(event.target)}
            inputProps={{
              step: 60,
            }}
          />
        }

        {(value.pyydys === "" || value.pyyntialue === "" || !catchAreas[String(value.pyydys)].includes(value.pyyntialue))
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            id="closed"
            type="time"
            className={classes.smallInputField}
            label={t("netclosed")}
            name="loppu"
            defaultValue={value.loppu}
            onChange={(event) => handleChange(event.target)}
            inputProps={{
              step: 60,
            }}
          />
        }

        {(value.pyydys === "" || value.pyyntialue === "" || !catchAreas[String(value.pyydys)].includes(value.pyyntialue))
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            className={classes.smallInputField}
            label={t("pcs")}
            id="selectCatchCount"
            name="lukumaara"
            required
            type="number"
            value={value.lukumaara}
            onChange={(event) => handleChange(event.target)}
            InputProps={{ inputProps: { min: 0 } }}
          />
        }

        {(value.pyydys === "" || value.pyyntialue === "" || !catchAreas[String(value.pyydys)].includes(value.pyyntialue))
          ? <div className={classes.inputField}></div>
          :
          <TextField
            className={classes.inputField}
            id="netCodes"
            name="verkkokoodit"
            label={t("netCodes")}
            onChange={(event) => handleChange(event.target)}
            value={value.verkkokoodit}
          />
        }

        {(value.pyydys === "" || value.pyyntialue === "" || !catchAreas[String(value.pyydys)].includes(value.pyyntialue))
          ? <div className={classes.smallInputField}></div>
          :
          (value.pyydys.length === 0 || (value.pyydys.length > 1 && catchesWithoutLength.indexOf(value.pyydys) > -1)) //is a catch without length
            ? <div className={classes.smallInputField}></div>
            :
            <TextField
              className={classes.smallInputField}
              label={t("netLength")}
              id="selectNetLength"
              required
              name="verkonPituus"
              type="number"
              value={value.verkonPituus}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{"m"}</InputAdornment>, inputProps: { min: 0 } }}
            />
        }

        <IconButton id="removeButton" size="medium" onClick={() => handleRowRemove()} className={classes.removeButton}>
          <HighlightOff fontSize="default" color="error" />
        </IconButton>
      </FormGroup>
    </Grid>

  );
};

CatchRow.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  catchRows: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(CatchRow);
