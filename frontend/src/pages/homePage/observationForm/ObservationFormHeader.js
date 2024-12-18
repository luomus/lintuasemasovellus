import React, {
  useState
} from "react";
import {
  Grid, TextField, Button, CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import localeFI from "date-fns/locale/fi";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Help from "../../../globalComponents/Help";

const useStyles = makeStyles(() => ({
  sendButton: {
    marginBottom: "20px",
    marginRight: "10px",
    marginTop: "20px",
    position: "static"
  },
  loadingIcon: {
    padding: "0px 5px 0px 0px",
    margin: "10px"
  },
  buttonAndIconsContainer: {
    display: "flex",
    alignItems: "center"
  }
}));

export const ObservationFormHeader = ({ day, observers, onDayChange, onObserversChange, toDayDetails }) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [toDayDetailsDisabled, setToDayDetailsDisabled] = useState(false);
  const [toDayDetailsLoadingIcon, setToDayDetailsLoadingIcon] = useState(false);
  const [datePickerErrorMessage, setDatePickerErrorMessage] = useState("");

  const handleToDayDetailsClick = async () => {
    setToDayDetailsLoadingIcon(true);
    setToDayDetailsDisabled(true);

    await toDayDetails();

    setToDayDetailsLoadingIcon(false);
    setToDayDetailsDisabled(false);
  };

  const toDayDetailsButtonDisabled = () => {
    if (observers === "" || observers.trim() === "")
      return true;
    else
      return false;
  };

  const handleDatePickerChange = (date, context) => {
    if (!context.validationError) {
      onDayChange(date);
    }
  };

  const handleDatePickerError = (error) => {
    let errorMsg = "";

    if (error === "invalidDate") {
      errorMsg = t("invalidDate");
    } else if (error === "minDate") {
      errorMsg = t("minDateError");
    } else if (error === "maxDate") {
      errorMsg = t("maxDateError");
    }

    setDatePickerErrorMessage(errorMsg);
  };

  return (
    <>
      <Grid item sm={3} background-color={"red"} style={{ minWidth: "150px" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeFI}>
          <DesktopDatePicker
            variant="inline"
            format="dd.MM.yyyy"
            label={t("date")}
            value={day}
            onChange={(date, context) => {
              handleDatePickerChange(date, context);
            }}
            onError={(newError) => handleDatePickerError(newError)}
            slotProps={{
              textField: {
                required: true,
                id: "date-picker-inline",
                "aria-label": "change date",
                helperText: datePickerErrorMessage
              },
              field: {
                clearable: true
              }
            }}
          />

        </LocalizationProvider>
      </Grid>

      <Grid item sm={9}>
        <TextField required
          fullWidth={true}
          id="observers"
          label={t("observers")}
          onChange={(event) => onObserversChange(event.target.value)}
          value={observers}
        />
      </Grid>
      <Grid item className={classes.buttonAndIconsContainer}>
        <Button
          id="toDayDetails"
          className={classes.sendButton}
          onClick={handleToDayDetailsClick}
          disabled={toDayDetailsButtonDisabled() || toDayDetailsDisabled}
          color="primary"
          variant="contained"
        >
          {t("toDayDetails")}
        </Button>
        <Help title={t("helpForToDayDetailsButton")} placement="right"/>
        { (toDayDetailsLoadingIcon) &&
                    <CircularProgress className={classes.loadingIcon} color="primary"/>
        }
      </Grid>
    </>
  );
};

ObservationFormHeader.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  observers: PropTypes.string.isRequired,
  onDayChange: PropTypes.func.isRequired,
  onObserversChange: PropTypes.func.isRequired,
  toDayDetails: PropTypes.func.isRequired
};
