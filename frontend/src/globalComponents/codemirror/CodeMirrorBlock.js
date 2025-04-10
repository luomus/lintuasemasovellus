import React, { useContext, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { UnControlled as CodeMirror } from "react-codemirror2";
import errorImg from "../../resources/warningTriangle.svg";
import "./cmError.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import { setNotifications, setNocturnalNotification } from "../../reducers/notificationsReducer";
import { isNightValidation } from "../../shorthand/validation/isNightValidation";
import { getOverlappingTimeRows } from "../../shorthand/validation/overlappingTimesValidation";
import { AppContext } from "../../AppContext";
import { dayStringToDate, getDaysObservationPeriods } from "../../services";
import { translateShorthandError } from "../../shorthand/utils";
import { validateShorthandLines } from "../../shorthand/validation/validation";
import { shorthandTextToLines } from "../../shorthand/shorthandParsing";


let markers = new Set();

const useStyles = makeStyles({
  codemirrorBox: {
    position: "relative",
    opacity: "99%",
  },
});

const CodeMirrorBlock = ({ value, onChange, dayId, day, type, activeObservationPeriodIds }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const { observatory } = useContext(AppContext);

  const [observationPeriods, setObservationPeriods] = useState([]);
  const [editorInstance, setEditorInstance] = useState();

  const [inputValue, setInputValue] = useState(value);
  const [startingValue, setStartingValue] = useState(value);

  useEffect(() => {
    if (value !== inputValue) {
      setStartingValue(value);
    }
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (editorInstance) {
        validateAndSetNotifications(editorInstance, value);
      }
    }, 700);
    return () => clearTimeout(timeout);
  }, [value, observationPeriods, day, type, activeObservationPeriodIds]);

  useEffect(() => {
    setObservationPeriods([]);
    getDaysObservationPeriods(dayId).then(observationPeriods => {
      setObservationPeriods(observationPeriods);
    });
  }, [dayId]);

  const validateOverlappingTimes = async (value) => {
    const getRowNumbers = await getOverlappingTimeRows(value, observationPeriods, activeObservationPeriodIds);

    if (getRowNumbers.length > 0) {
      return getRowNumbers;
    } else {
      return false;
    }

  };

  const setMarker = (editor, rowNum, rowMessage, background, textColor) => {

    const marker = editor.getDoc().markText({
      line: rowNum,
      ch: 0
    }, {
      line: rowNum,
      ch: rowMessage.length
    }, {
      css: `background-color: ${background}; color: ${textColor}`,
      clearOnEnter: true,
      inclusiveRight: true
    });
    const icon = document.createElement("img");
    icon.setAttribute("src", errorImg);
    icon.className = "lint-error-icon";
    editor.setGutterMarker(rowNum, "note-gutter", icon);
    markers.add(marker);
  };


  const setValidateNightNotification = (value,editor) => {
    if (!day) {
      return;
    }
    const valuesToArray = value.split("\n");
    const nightRows = type === t("nightMigration") ? isNightValidation(observatory, value, dayStringToDate(day)) : [];
    nightRows.length === 0 && dispatch(setNocturnalNotification(false));
    for (const row of nightRows) {
      nightRows.length > 0 && dispatch(setNocturnalNotification(true));
      setMarker(editor, row-1, valuesToArray[row-1], "#402158", "#ffff00");
    }
  };

  const setValidateOverlappingTimesNotification = async (value, editor, result) => {
    const rowNumbers = await validateOverlappingTimes(value) ? await validateOverlappingTimes(value) : [];

    const valuesToArray = value.split("\n");

    for (const row of rowNumbers) {
      rowNumbers.length > 0 && result.push("Tarkista rivi " + row + ":" + " Ei päällekkäisiä aikoja!");
      setMarker(editor, row-1, valuesToArray[row-1], "#f5f890", "#000000");
    }

    return result;
  };

  const validate = (editor, value) => {
    let toErrors = [];

    const lines = shorthandTextToLines(value);
    const errors = validateShorthandLines(lines);

    for (const marker of markers) {
      marker.clear();
    }
    editor.clearGutter("note-gutter");

    for (const error of errors) {
      const rowNum = error[0];
      const rowMessage = error[1];
      toErrors.push(t("checkRow", { row: rowNum + 1 }) + translateShorthandError(t, rowMessage));
      setMarker(editor,rowNum,rowMessage,"#f5f890","#000000");
    }

    return toErrors;
  };

  const validateAndSetNotifications = async (editor, value) => {
    const result = validate(editor, value);
    setValidateNightNotification(value, editor);
    const newResult = await setValidateOverlappingTimesNotification(value,editor,result);

    dispatch(setNotifications([[], newResult], "shorthand", 0));
  };

  return (
    <CodeMirror
      id="shorthand"
      className={classes.codemirrorBox}
      value={startingValue}
      options={{
        theme: "idea",
        lineNumbers: true,
        autoRefresh: true,
        gutters: ["note-gutter"],
        lint: true
      }}
      editorDidMount={editor => {
        setEditorInstance(editor);
        editor.refresh();
      }}
      onChange={(editor, data, value) => {
        setInputValue(value);
        onChange(value);
      }}
    />
  );
};

CodeMirrorBlock.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  dayId: PropTypes.number,
  day: PropTypes.string,
  type: PropTypes.string,
  activeObservationPeriodIds: PropTypes.array,
};

export default memo(CodeMirrorBlock);
