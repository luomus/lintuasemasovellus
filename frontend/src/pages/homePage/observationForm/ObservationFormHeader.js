import React, {
  useEffect, useRef,
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
import { useDispatch, useSelector } from "react-redux";
import { setObservers, setDay } from "../../../reducers/formDataReducer/baseFormDataReducer";
import { dateToDayString } from "../../../services";
import { dateSelector } from "../../../reducers/formDataReducer/formDataReducer";

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

export const ObservationFormHeader = ({ confirmDateChange, toDayDetails }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const date = useSelector(dateSelector);
  const observers = useSelector(state => state.formData.baseData.observers);

  const [datepickerDate, setDatepickerDate] = useState(date);
  const [datepickerValidDate, setDatepickerValidDate] = useState(date);
  const [datePickerErrorMessage, setDatePickerErrorMessage] = useState("");
  const [dateChangeConfirmed, setDateChangeConfirmed] = useState(false);

  const [toDayDetailsDisabled, setToDayDetailsDisabled] = useState(false);
  const [toDayDetailsLoadingIcon, setToDayDetailsLoadingIcon] = useState(false);

  const datePickerInput = useRef(null);

  useEffect(() => {
    if (date?.getTime() === datepickerValidDate?.getTime()) {
      return;
    }
    setDatepickerDate(date);
    setDatepickerValidDate(date);
    setDatePickerErrorMessage("");
  }, [date]);

  const handleToDayDetailsClick = async () => {
    setToDayDetailsLoadingIcon(true);
    setToDayDetailsDisabled(true);

    await toDayDetails();

    setToDayDetailsLoadingIcon(false);
    setToDayDetailsDisabled(false);
  };

  const toDayDetailsButtonDisabled = () => {
    if (!date || observers === "" || observers.trim() === "")
      return true;
    else
      return false;
  };

  const handleDatePickerChange = (newDate, context) => {
    updateDatePickerErrorMessage(context?.validationError);

    if (!context?.validationError) {
      setDatepickerValidDate(newDate);

      if (document.activeElement === datePickerInput.current) { // when the date is entered by typing, update it on blur
        return;
      }

      handleDateChange(newDate);
    } else {
      setDatepickerValidDate(null);
    }
  };

  const handleDatePickerBlur = () => {
    if (datepickerValidDate?.getTime() !== date?.getTime()) {
      handleDateChange(datepickerValidDate);
    }
  };

  const updateDatePickerErrorMessage = (error) => {
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

  const handleDateChange = (newDate) => {
    if (!confirmDateChange() || dateChangeConfirmed) {
      dispatch(setDay(dateToDayString(newDate)));
    } else {
      if (confirm(t("changeDateWhenObservationsConfirm"))) {
        confirmDate();
        dispatch(setDay(dateToDayString(newDate)));
      } else {
        const oldDate = new Date(date.getTime());
        setDatepickerDate(oldDate); // force datepicker to keep the earlier date
        setDatepickerValidDate(oldDate);
      }
    }
  };

  const confirmDate = () => {
    setDateChangeConfirmed(true);
    setTimeout(function () {
      setDateChangeConfirmed(false);
    }, 10000);
  };

  const observersChange = (observers) => {
    dispatch(setObservers(observers));
  };

  return (
    <>
      <Grid item sm={3} background-color={"red"} style={{ minWidth: "150px" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeFI}>
          <DesktopDatePicker
            variant="inline"
            format="dd.MM.yyyy"
            label={t("date")}
            value={datepickerDate}
            onChange={handleDatePickerChange}
            slotProps={{
              textField: {
                inputRef: datePickerInput,
                required: true,
                id: "date-picker-inline",
                "aria-label": "change date",
                helperText: datePickerErrorMessage,
                onBlur: handleDatePickerBlur
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
          onChange={(event) => observersChange(event.target.value)}
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
  confirmDateChange: PropTypes.func.isRequired,
  toDayDetails: PropTypes.func.isRequired
};
