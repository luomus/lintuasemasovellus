import React from "react";
import { HighlightOff } from "@mui/icons-material";
import {
  TextField, InputLabel, Select, MenuItem, FormControl,
  FormControlLabel, InputAdornment, Grid, FormGroup, IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
import { toggleCatchDetails, deleteOneCatchRow } from "../../reducers/catchRowsReducer";
import { setNotifications } from "../../reducers/notificationsReducer";


const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 105,
    padding: "0px 10px 0px 0px",
    margin: theme.spacing(1),
  },
  formControlLabel: {
    padding: "0px 10px 0px 0px",
    margin: theme.spacing(1),
  },
  formControlLabel2: {
    padding: "0px 10px 0px 0px",
    margin: theme.spacing(1),
    marginTop: theme.spacing(3)
  },
  formControlLabel3: {
    margin: theme.spacing(1)
  },
  netCodes: {
    width: 110,
  },
  numberField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 90
  },
  netCodesField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 175
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



const CatchType = ({ cr }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const dailyActions = useSelector(state => state.dailyActions);
  const allCatchRows = useSelector(state => state.catchRows);


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
    if (dailyActions.standardRing) {
      let standardCatch = false;
      Object.keys(allCatchRows).map((c) => {
        if (allCatchRows[String(c)].pyydys === "Vakioverkko") {
          standardCatch = true;
        }
      });
      if (!standardCatch) {
        dispatch(setNotifications([[], [t("expectingStandardCatch")]], "catches", 0));
      }
    }
    if (cr.pyydys && cr.pyyntialue) {
      Object.keys(allCatchRows).map((c) => {
        if (allCatchRows[String(c)].key !== cr.key && allCatchRows[String(c)].pyydys === cr.pyydys && allCatchRows[String(c)].pyyntialue === cr.pyyntialue && allCatchRows[String(c)].alku === cr.alku && allCatchRows[String(c)].loppu === cr.loppu) {
          toErrors.push(t("duplicateCatches", { char: cr.pyyntialue }));
        }
      });
    } else {
      dispatch(setNotifications([[], []], "catches", 0));
    }

    return [toNotifications, toErrors];
  };


  const handleChange = (target) => {
    let realTimeRow = cr;


    if (target.name === "pyydys") {
      //rechoosing catchType, empty area to prevent previous options are from persisting
      dispatch(toggleCatchDetails(cr.key, "pyyntialue", ""));
      dispatch(toggleCatchDetails(cr.key, "lukumaara", 0));
      realTimeRow = { ...realTimeRow, lukumaara: 0, pyyntialue: "" };
    }
    if (target.name === "pyyntialue") {
      //catch actively clicked, set amount to minumn,
      dispatch(toggleCatchDetails(cr.key, "lukumaara", 1));
      realTimeRow = { ...realTimeRow, lukumaara: 1 };
    }

    if (target.name === "pyyntialue" && !catchesWithoutLength.includes(cr.pyydys)) {//cr.pyydys !== "Rastasverkko") {
      //autofill length for nets that are always the same length
      if (target.value in preSetLengths) {
        dispatch(toggleCatchDetails(cr.key, "verkonPituus", preSetLengths[String(target.value)]));
        realTimeRow = { ...realTimeRow, verkonPituus: preSetLengths[String(target.value)] };
      } else {
        dispatch(toggleCatchDetails(cr.key, "verkonPituus", 9));
        realTimeRow = { ...realTimeRow, verkonPituus: 9 };
      }
    } else if (target.name === "pyydys" && cr.verkonPituus !== 0) {
      //remove previous length autofill, when catch changes
      dispatch(toggleCatchDetails(cr.key, "verkonPituus", 0));
      realTimeRow = { ...realTimeRow, verkonPituus: 0 };
    }
    dispatch(toggleCatchDetails(cr.key, target.name, target.value));
    //run validations on change
    const result = validate({ ...realTimeRow, [target.name]: target.value });
    dispatch(setNotifications([result[0], result[1]], "catches", cr.key));
  };

  const handleRowRemove = () => {
    dispatch(deleteOneCatchRow(cr));
    dispatch(setNotifications([[], []], "catches", cr.key));
  };


  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <TextField
          required
          select
          className={classes.formControl}
          label={t("catchType")}
          id="selectCatchType"
          name="pyydys"
          slotProps={{
            select: {
              value: cr.pyydys,
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
          className={classes.formControl}
          label={t("catchArea")}
          id="selectCatchArea"
          name="pyyntialue"
          slotProps={{
            select: {
              value: cr.pyyntialue,
              onChange: (event) => handleChange(event.target)
            }
          }}
        >
          {
            catchAreas[String(cr.pyydys)].map((cArea, i) =>
              <MenuItem id={cArea} value={cArea} key={i}>
                {cArea}
              </MenuItem>
            )
          }
        </TextField>

        {(cr.pyydys === "" || cr.pyyntialue === "" || !catchAreas[String(cr.pyydys)].includes(cr.pyyntialue))
          ? <div></div>
          :
          <FormControlLabel className={classes.formControlLabel2}
            label={t("netopened")} labelPlacement="start"
            control={<TextField
              id="opened"
              type="time"
              defaultValue={cr.alku}
              name="alku"
              style={{ paddingLeft: "5px" }}
              onChange={(event) => handleChange(event.target)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 60,
              }}
            />} />
        }

        {(cr.pyydys === "" || cr.pyyntialue === "" || !catchAreas[String(cr.pyydys)].includes(cr.pyyntialue))
          ? <div></div>
          :
          <FormControlLabel className={classes.formControlLabel2}
            label={t("netclosed")} labelPlacement="start"
            control={<TextField
              id="closed"
              type="time"
              name="loppu"
              defaultValue={cr.loppu}
              style={{ paddingLeft: "5px" }}
              onChange={(event) => handleChange(event.target)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 60,
              }}
            />} />
        }

        {(cr.pyydys === "" || cr.pyyntialue === "" || !catchAreas[String(cr.pyydys)].includes(cr.pyyntialue))
          ? <div></div>
          :
          <FormControlLabel className={classes.formControlLabel2}
            label="" labelPlacement="start"
            control={
              <TextField
                className={classes.numberField}
                id="selectCatchCount"
                name="lukumaara"
                required
                type="number"
                value={cr.lukumaara}
                onChange={(event) => handleChange(event.target)}
                hiddenLabel={true}
                InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}
              />
            } />
        }

        {(cr.pyydys === "" || cr.pyyntialue === "" || !catchAreas[String(cr.pyydys)].includes(cr.pyyntialue))
          ? <div></div>
          :
          <FormControl className={classes.formControlLabel}>
            <TextField
              className={classes.netCodesField}
              id="netCodes"
              name="verkkokoodit"
              label={t("netCodes")}
              onChange={(event) => handleChange(event.target)}
              value={cr.verkkokoodit}
            />
          </FormControl>
        }

        {(cr.pyydys === "" || cr.pyyntialue === "" || !catchAreas[String(cr.pyydys)].includes(cr.pyyntialue))
          ? <div></div>
          :
          (cr.pyydys.length === 0 || (cr.pyydys.length > 1 && catchesWithoutLength.indexOf(cr.pyydys) > -1)) //is a catch without length
            ? <div></div>
            :
            <FormControlLabel className={classes.formControlLabel2}
              label={t("netLength")} labelPlacement="start"
              control={<TextField
                className={classes.numberField}
                id="selectNetLength"
                required
                name="verkonPituus"
                type="number"
                value={cr.verkonPituus}
                onChange={(event) => handleChange(event.target)}
                InputProps={{ endAdornment: <InputAdornment position="end">{"m"}</InputAdornment>, inputProps: { min: 0 } }}
              />
              } />
        }

        <IconButton id="removeButton" size="medium" onClick={() => handleRowRemove()} className={classes.formControlLabel3}>
          <HighlightOff fontSize="default" color="error" />
        </IconButton>
      </FormGroup>
    </Grid>

  );
};

CatchType.propTypes = {
  cr: PropTypes.object.isRequired,
};

export default CatchType;
