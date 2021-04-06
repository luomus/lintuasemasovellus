import React from "react";
import {
  loopThroughCheckForErrors, getErrors, resetErrors
} from "../../shorthand/validations";
import { Controlled as CodeMirror } from "react-codemirror2";
import errorImg from "../../resources/warningTriangle.svg";
import "./cmError.css";
import { makeStyles } from "@material-ui/core";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import PropTypes from "prop-types";


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
  setCodeMirrorHasErrors,
  setSanitizedShorthand,
}) => {

  const classes = useStyles();

  const errorCheckingLogic = async (editor, data, value) => {
    setSanitizedShorthand(loopThroughCheckForErrors(value));
    for (const marker of markers) {
      marker.clear();
    }
    editor.clearGutter("note-gutter");
    const errors = getErrors();
    for (const error of errors) {
      const rowNum = error[0];
      const rowMessage = error[1];
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
    if (errors.length === 0) setCodeMirrorHasErrors(false);
    else setCodeMirrorHasErrors(true);
    resetErrors();
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
      errorCheckingLogic(editor, data, value);
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
      onChange={codemirrorOnchange}
    />
  );
};

CodeMirrorBlock.propTypes = {
  shorthand: PropTypes.string.isRequired,
  setShorthand: PropTypes.func.isRequired,
  setCodeMirrorHasErrors: PropTypes.func.isRequired,
  setSanitizedShorthand: PropTypes.func.isRequired,
};

export default CodeMirrorBlock;
