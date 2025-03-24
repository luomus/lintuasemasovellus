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

const catchAreas = [
  "Vakioverkot",
  "Vakioverkko, K",
  "Piha",
  "Petoverkko",
  "Ruovikko",
  "Kahlaajakatiska",
  "Siemenkatiska",
  "Lisäverkko",
  "Haukkahäkki"
];

const catchMethods = {
  "Vakioverkot": "W / C",
  "Vakioverkko, K": "W / C",
  "Piha": "L",
  "Petoverkko": "V / C",
  "Ruovikko": "L",
  "Kahlaajakatiska": "K",
  "Siemenkatiska": "K",
  "Lisäverkko": "L",
  "Haukkahäkki": "H"
};


/*const softAmountLimits = {
  "Lisäverkko": { "Piha": 9 },
  "Petoverkot": { "Vakiopetoverkot": 8 },
};

const hardAmountLimits = {
  "Vakioverkot K": 1,
  "Vakioverkot muu": 11
};*/

const catchesWithoutLength = ["Kahlaajakatiska", "Siemenkatiska", "Haukkahäkki"];

const preSetLengths = {
  "Vakioverkot": 9,
  "Vakioverkko, K": 12,
  "Piha": 9,
  "Petoverkko": 12,
  "Ruovikko": 9,
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
    /*if ((cr.pyydys in softAmountLimits && cr.pyyntialue in softAmountLimits[String(cr.pyydys)] && cr.lukumaara > softAmountLimits[String(cr.pyydys)][String(cr.pyyntialue)]) || cr.lukumaara > 15) {
      toNotifications.push(t("checkNumberOfCatches", { char: cr.pyydys }));
    }*/
    if (cr.pyyntialue && !catchesWithoutLength.includes(cr.pyyntialue) && cr.verkonPituus && (cr.verkonPituus < 9 || cr.verkonPituus > 12)) {
      toNotifications.push(t("checkNetLength", { char: cr.pyyntialue }));
    }

    //errors, prevent saving
    if (!cr.pyyntialue) {
      toErrors.push(t("noCatchArea"));
    } else if (!cr.pyyntitapa || !cr.alku || !cr.loppu || cr.lukumaara === "" || cr.verkonPituus === "") {
      toErrors.push(t("noEmptyValues"));
    }
    if (cr.lukumaara < 0 || cr.verkonPituus < 0) {
      toErrors.push(t("noNegativeValues"));
    }
    if (cr.alku && cr.loppu) {
      if (cr.alku.slice(0, 2) > cr.loppu.slice(0, 2) || (cr.alku.slice(0, 2) === cr.loppu.slice(0, 2) && cr.alku.slice(3, 5) > cr.loppu.slice(3, 5)))
        toErrors.push(t("closeBeforeOpen", { char: cr.pyyntialue }));
    }
    if (cr.pyyntialue && cr.lukumaara === "0") {
      toErrors.push(t("noZeroAmount", { char: cr.pyyntialue }));
    }
    /*if ((cr.pyyntialue in hardAmountLimits && cr.lukumaara > hardAmountLimits[String(cr.pyyntialue)])) {
      toErrors.push(t("maxCatchValue", { char1: cr.pyyntialue, char2: hardAmountLimits[String(cr.pyyntialue)] }));
    }*/
    /*if (cr.pyyntialue) {
      for (let c of Object.keys(catchRows)) {
        if (catchRows[String(c)].key !== cr.key && catchRows[String(c)].pyyntialue === cr.pyyntialue && catchRows[String(c)].alku === cr.alku && catchRows[String(c)].loppu === cr.loppu) {
          toErrors.push(t("duplicateCatches", { char: cr.pyyntialue }));
          break;
        }
      }
    }*/

    return [toNotifications, toErrors];
  };

  const handleChange = (target) => {
    const newValue = { ...value };

    if (target.name === "pyyntialue") {
      newValue["pyyntitapa"] = catchMethods[String(target.value)];
      //autofill length for nets that are always the same length
      if (target.value in preSetLengths) {
        newValue["verkonPituus"] = preSetLengths[String(target.value)];
      } else if (catchesWithoutLength.includes(target.value)) {
        newValue["verkonPituus"] = 0;
      }
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
            catchAreas.map((catchArea, i) =>
              <MenuItem id={catchArea} value={catchArea} key={i}>
                {catchArea}
              </MenuItem>
            )
          }
        </TextField>

        {value.pyyntialue === ""
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            required
            value={value.pyyntitapa}
            className={classes.smallInputField}
            label={t("catchMethod")}
            id="selectCatchMethod"
            name="pyyntitapa"
            slotProps={{
              input: { readOnly: true }
            }}
          >
            {value.pyyntitapa}
          </TextField>
        }

        {value.pyyntialue === ""
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            required
            id="opened"
            type="time"
            className={classes.smallInputField}
            label={t("netopened")}
            defaultValue={value.alku}
            name="alku"
            onChange={(event) => handleChange(event.target)}
            slotProps={{
              htmlInput: { step: 60 },
              inputLabel: { shrink: true }
            }}
          />
        }

        {value.pyyntialue === ""
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            required
            id="closed"
            type="time"
            className={classes.smallInputField}
            label={t("netclosed")}
            name="loppu"
            defaultValue={value.loppu}
            onChange={(event) => handleChange(event.target)}
            slotProps={{
              htmlInput: { step: 60 },
              inputLabel: { shrink: true }
            }}
          />
        }

        {value.pyyntialue === ""
          ? <div className={classes.smallInputField}></div>
          :
          <TextField
            className={classes.smallInputField}
            label={t("pcsUpper")}
            id="selectCatchCount"
            name="lukumaara"
            required
            type="number"
            value={value.lukumaara}
            onChange={(event) => handleChange(event.target)}
            slotProps={{
              htmlInput: { min: 0 },
              inputLabel: { shrink: true }
            }}
          />
        }

        {value.pyyntialue === "" || catchesWithoutLength.includes(value.pyyntialue)
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
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">{"m"}</InputAdornment>
              },
              htmlInput: { min: 0 },
              inputLabel: { shrink: true }
            }}
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
