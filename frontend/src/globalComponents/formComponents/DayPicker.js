import React, {
  memo,
  useEffect, useRef,
  useState
} from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import localeFI from "date-fns/locale/fi";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { dateToDayString, dayStringToDate } from "../../services";


const DayPicker = ({ value, onChange, canChange, required }) => {
  const { t } = useTranslation();

  const [datepickerDate, setDatepickerDate] = useState(null);
  const [datepickerValidDate, setDatepickerValidDate] = useState(null);
  const [datePickerErrorMessage, setDatePickerErrorMessage] = useState("");

  const datePickerInput = useRef(null);

  useEffect(() => {
    const date = dayStringToDate(value);
    if (date?.getTime() === datepickerValidDate?.getTime()) {
      return;
    }
    setDatepickerDate(date);
    setDatepickerValidDate(date);
    setDatePickerErrorMessage("");
  }, [value]);

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
    if (datepickerValidDate?.getTime() !== dayStringToDate(value)?.getTime()) {
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
    if (!canChange || canChange()) {
      onChange(dateToDayString(newDate));
    } else {
      const oldDate = new Date(dayStringToDate(value).getTime());
      setDatepickerDate(oldDate); // force datepicker to keep the earlier date
      setDatepickerValidDate(oldDate);
    }
  };

  return (
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
            required: required,
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
  );
};

DayPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  canChange: PropTypes.func,
  required: PropTypes.bool
};

export default memo(DayPicker);
