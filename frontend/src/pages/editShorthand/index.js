import {
  Backdrop, Fade, makeStyles, Modal, Grid, Button
} from "@material-ui/core";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
//import errorImg from "./error.png";

const EditShorthand = ({ date, dayId, open, handleClose }) => {

  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA", dayId);

  const [shorthand, setShorthand] = useState("");

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center",
      outline: "none",
    },
    paper: {
      backgroundColor: "white",
      height: "85%",
      width: "85%",
      padding: theme.spacing(2, 4, 3),
      overflowY: "scroll",
      overflowX: "hidden",
    },
    root: {
      "& .MuiFormControl-root": {
        width: "70%",
        margin: "1em"
      }
    },
  }));

  const { t } = useTranslation();

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);


  const classes = useStyles();

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }


  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      disableAutoFocus={true}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2> {t("editShorthand")}</h2>
          <h2> {date} </h2>

          <Grid item xs={12}>
            <CodeMirror
              id="editShorthand"
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
            //onChange={codemirrorOnchange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={() => console.log("click")}>
              {t("save")}
            </Button>{" "}
            <Button variant="contained" color="primary" onClick={() => console.log("click")}>
              {t("cancel")}
            </Button>{" "}
            <Button variant="contained" color="primary" onClick={() => console.log("click")}>
              {t("remove")}
            </Button>{" "}
          </Grid>
        </div>
      </Fade>
    </Modal>

  );
};

EditShorthand.propTypes = {
  date: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditShorthand;