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
    let day = d;

    Number(m) < 10 ? month = month.concat(m) : month === m;

    let newDate = day+"."+ month +"."+ year ;

    const findDay = dayList.length > 0 && dayList.find(d => d.day === newDate && d.observatory === observatory);

    if (findDay && await observationsOnTop(findDay.id,value)) {
      return true;
    } else {
      return false;
    }

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
      const marker = editor.getDoc().markText({
        line: rowNum,
        ch: 0
      }, {
        line: rowNum,
        ch: rowMessage.length - 1
      }, {
        css: "background-color: #f5f890;",
        clearOnEnter: true,
        inclusiveRight: true
      });
      const icon = document.createElement("img");
      icon.setAttribute("src", errorImg);
      icon.className = "lint-error-icon";
      editor.setGutterMarker(rowNum, "note-gutter", icon);
      markers.add(marker);
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
      await validateObservationOnTop(value) && result.push("Ei päällekkäisiä aikoja!");
      const isPushed = result.some(r => r === "Ei päällekkäisiä aikoja!");
      isPushed && await !validateObservationOnTop(value) && result.pop();
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