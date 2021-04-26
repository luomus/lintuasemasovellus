import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Controlled as CodeMirror } from "react-codemirror2";
import {
  loopThroughCheckForErrors, getErrors, resetErrors
} from "../../shorthand/validations";
import errorImg from "../../resources/warningTriangle.svg";
import "./cmError.css";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import { setNotifications } from "../../reducers/notificationsReducer";


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
}) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();

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
    timeout = setTimeout(() => {
      const result = validate(editor, data, value);
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
};

export default CodeMirrorBlock;