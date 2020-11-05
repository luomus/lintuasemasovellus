import { Fade, makeStyles, Modal, Backdrop, Button } from "@material-ui/core";
import React, {
  useEffect,
  useState
} from "react";
import PropTypes from "prop-types";
import { sendDay, loopThroughObservationPeriods, loopThroughObservations } from "./parseShorthandField";
import { resetAll } from "../../shorthand/shorthand";
import { loopThroughCheckForErrors, getErrors, resetErrors } from "./validations";

const FeedbackModal = (props) => {

  const {
    open, handleClose,
    shorthand, date, observers, comment, type, location, observatory
  } = props;

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

  const [errors, setErrors] = useState([]);

  useEffect(() => {
    resetErrors();
    loopThroughCheckForErrors(shorthand);
    const errorList = getErrors();
    setErrors(errorList);
    resetAll();
  }, [open]);

  console.log("errors list", errors);

  const sendData = async () => {
    const shorthandRows = shorthand.split("\n");
    await sendDay({
      day: date,
      comment,
      observers,
      observatory
    });
    await loopThroughObservationPeriods(shorthandRows, type, location);
    await loopThroughObservations(shorthandRows);
    resetAll();
  };

  const classes = useStyles();

  const SendButton = () => {
    if (errors.length > 0) return null;
    return <Button onClick={sendData}>send</Button>;
  };

  return (
    <Modal aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}>
      <Fade in={open}>
        <div className={classes.paper}>
          {
            errors.map((e, i) =>
              <div key={i}>{e}</div>
            )
          }
          <div>{shorthand}</div>
          <div>{date}</div>
          <div>{observers}</div>
          <div>{comment}</div>
          <div>{type}</div>
          <div>{location}</div>
          <SendButton />
        </div>
      </Fade>

    </Modal>

  );
};

FeedbackModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  observers: PropTypes.string.isRequired,
  shorthand: PropTypes.string.isRequired,
  comment: PropTypes.string,
  type: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  observatory: PropTypes.string.isRequired
};

export default FeedbackModal;
