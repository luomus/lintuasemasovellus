import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Controlled as CodeMirror } from "react-codemirror2";
import {
  loopThroughCheckForErrors, getErrors, resetErrors
} from "../../shorthand/newValidations";
import errorImg from "../../resources/warningTriangle.svg";
import "./cmError.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import { setNotifications, setNocturnalNotification } from "../../reducers/notificationsReducer";
import { useSelector } from "react-redux";
import { isNightValidation } from "../../shorthand/isNightValidation";
import { observationsOnTop } from "../../shorthand/observationsOnTopValidation";


let timeout = null;
let markers = new Set();

const useStyles = makeStyles({
  codemirrorBox: {
    position: "relative",
    opacity: "99%",
  },
});

const CodeMirrorBlock = ({
  shorthand,
  setShorthand,
  setSanitizedShorthand,
  date,
  type
}) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

  const observatory = useSelector(state => state.userObservatory);
  const dayList = useSelector(state => state.days);

  const validateObservationOnTop = async (value) => {

    const [d, m, y] = [date.getDate(), date.getMonth()+1, date.getFullYear()];

    let month = "0";
    let year = y;
    let day = "0";

    console.log("d: ", d);

    Number(m) < 10 ? month = month.concat(m) : month = m;
    Number(d) < 10 ? day = day.concat(d) : day = d;

    let newDate = day+"."+ month +"."+ year;
    console.log("newDate: ", newDate);

    const findDay = dayList.length > 0 && dayList.find(d => d.day === newDate && d.observatory === observatory);
    console.log("findDay: ", findDay);
    const getRowNumbers = findDay ? await observationsOnTop(findDay.id,value) : [];

    if (findDay && getRowNumbers.length > 0) {
      return getRowNumbers;
    } else {
      return false;
    }

  };

  const setMarker = (editor, rowNum, rowMessage, background) => {
    console.log("row number: ", rowNum);
    console.log("editor: ", editor);
    const marker = editor.getDoc().markText({
      line: rowNum,
      ch: 0
    }, {
      line: rowNum,
      ch: rowMessage.length
    }, {
      css: `background-color: ${background};`,
      clearOnEnter: true,
      inclusiveRight: true
    });
    const icon = document.createElement("img");
    icon.setAttribute("src", errorImg);
    icon.className = "lint-error-icon";
    editor.setGutterMarker(rowNum, "note-gutter", icon);
    markers.add(marker);
  };


  const validateNight = (value) => {
    if (value === "") {
      dispatch(setNocturnalNotification(false));
    } else if (type === t("nightMigration") && isNightValidation(observatory, value, date)) {
      dispatch(setNocturnalNotification(true));
    } else {
      dispatch(setNocturnalNotification(false));
    }
  };

  const validate = (editor, data, value) => {
    let toErrors = [];

    setSanitizedShorthand(loopThroughCheckForErrors(value));
    for (const marker of markers) {
      marker.clear();
    }
    editor.clearGutter("note-gutter");
    const shorthandErrors = getErrors();
    for (const error of shorthandErrors) {
      const rowNum = error[0];
      const rowMessage = error[1];
      (rowMessage.includes("unknownCharacter")) ?
        toErrors.push(t("checkRow", { row: rowNum + 1 }) + t("unknownCharacter", { char: (rowMessage.slice(-1)) }))
        : toErrors.push(t("checkRow", { row: rowNum + 1 }) + t(rowMessage));

      setMarker(editor,rowNum,rowMessage,"#f5f890");
    }
    resetErrors();

    return toErrors;
  };

  /**
   * Start checking for errors only after being idle for the duration of
   * the timeout (700ms).
   * @param {object} editor
   * @param {object} data
   * @param {string} value
   */
  const codemirrorOnchange = (editor, data, value) => {

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(async () => {
      validateNight(value);
      const result = validate(editor, data, value);
      const rowNumbers = await validateObservationOnTop(value) ? await validateObservationOnTop(value) : [];

      const valuesToArray = value.split("\n");
      console.log("values to Array: ", valuesToArray);


      for (const row of rowNumbers) {
        rowNumbers.length > 0 && result.push("Tarkista rivi " + row + ":" + " Ei päällekkäisiä aikoja!");
        setMarker(editor, row-1, valuesToArray[row-1], "#f5f890");
      }

      dispatch(setNotifications([[], result], "shorthand", 0));
      timeout = null;
    }, 700);
  };


  return (
    <CodeMirror
      id="shorthand"
      className={classes.codemirrorBox}
      value={shorthand}
      options={{
        theme: "idea",
        lineNumbers: true,
        autoRefresh: true,
        readOnly: false,
        gutters: ["note-gutter"],
        lint: true
      }}
      editorDidMount={editor => {
        editor.refresh();
      }}
      onBeforeChange={(editor, data, value) => {
        setShorthand(value);
      }}
      onChange={(editor, data, value) => {
        codemirrorOnchange(editor, data, value);
      }}
    />
  );
};

CodeMirrorBlock.propTypes = {
  shorthand: PropTypes.string.isRequired,
  setShorthand: PropTypes.func.isRequired,
  setSanitizedShorthand: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date),
  type: PropTypes.string
};

export default CodeMirrorBlock;