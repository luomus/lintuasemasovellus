import React from "react";
import {
  loopThroughCheckForErrors, getErrors, resetErrors
} from "../../shorthand/validations";
import { Controlled as CodeMirror } from "react-codemirror2";
import errorImg from "../../resources/error.png";
import "./cmError.css";
import { makeStyles } from "@material-ui/core";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import PropTypes from "prop-types";


let timeout = null;
let widgets = new Set();

const useStyles = makeStyles({
  codemirrorBox: {
    position: "relative",
    opacity: "99%"
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
    for (const widget of widgets) {
      editor.removeLineWidget(widget);
    }
    widgets.clear();
    const errors = getErrors();
    for (let i = 0; i < errors.length; i++) {
      const msg = document.createElement("div");
      const icon = msg.appendChild(document.createElement("img"));
      msg.className = "lint-error";
      icon.setAttribute("src", errorImg);
      icon.className = "lint-error-icon";
      msg.appendChild(document.createTextNode(errors[Number(i)]));
      widgets.add(editor.addLineWidget(data.to.line, msg, {
        coverGutter: false, noHScroll: true
      }));
    }
    if (errors.length === 0) setCodeMirrorHasErrors(false);
    else setCodeMirrorHasErrors(true);
    resetErrors();
  };

  /**
   * Start checking for errors only after being idle for the duration of
   * the timeout (500ms).
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
    }, 500);
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
        lint: false
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
