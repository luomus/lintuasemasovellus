import {
  Backdrop, Fade, makeStyles, Modal
} from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
//import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const EditShorthand = ({ dayId, open, handleClose }) => {

  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA" , dayId);

  const useStyles = makeStyles(() => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: "white",
      border: "2px solid #000",
      height: "85%",
      width: "85%",
      padding: "2px 2px 2px 2px",
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

  //const { t } = useTranslation();

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
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h2> MOIII </h2>
        </div>
      </Fade>
    </Modal>

  );
};

EditShorthand.propTypes = {
  dayId: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditShorthand;