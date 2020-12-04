import {
  Backdrop, Fade, makeStyles, Modal, Grid, Button,
  FormControl, InputLabel, Select, MenuItem, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import errorImg from "./error.png";
import {
  getShorthandText, deleteShorthand, deleteObservations, deleteObservationperiod
} from "../../services";
import {
  loopThroughCheckForErrors, getErrors, resetErrors
} from "../../shorthand/validations";
import {
  loopThroughObservationPeriods, loopThroughObservations, setDayId
} from "../homePage/parseShorthandField";


let timeout = null;

let sanitizedShorthand = null;

let widgets = new Set();

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
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  codemirrorBox: {
    position: "relative",
    opacity: "99%"
  },
  root: {
    "& .MuiFormControl-root": {
      width: "70%",
      margin: "1em"
    }
  },
}));


const EditShorthand = ({ date, dayId, open, handleClose }) => {

  console.log(dayId);

  const [defaultShorthand, setDefaultShorthand] = useState([]);
  const [shorthand, setShorthand] = useState("");
  const [codeMirrorHasErrors, setCodeMirrorHasErrors] = useState(false);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [warning, setWarning] = useState(false);

  const userObservatory = useSelector(state => state.userObservatory);
  const stations = useSelector(state => state.stations);

  console.log(userObservatory);

  const initializeDefaultShorthand = (defaultShorthand) => {
    let text = "";
    for (const shorthandObject of defaultShorthand) {
      text += shorthandObject.startTime;
      text += "\n";
      for (const shorthandObject2 of shorthandObject.shorthands) {
        text += shorthandObject2.shorthand_text;
        text += "\n";
      }
      text += shorthandObject.endTime;
      text += "\n";
    }
    setShorthand(text);
  };

  const handleDialogOpen = () => {
    setWarning(true);
    console.log(warning);
  };

  const handleDialogClose = () => {
    setWarning(false);
  };

  const handleDialogConfirm = () => {
    setWarning(false);
    handleDelete();
  };

  const deleteButtonIsDisabled = () => {
    if (shorthand === "") {
      return true;
    } else {
      return false;
    }
  };

  const handleDelete = async () => {
    for (const obsperiod of defaultShorthand) {
      for (const shorthandrow of obsperiod.shorthands) {
        console.log(shorthandrow.shorthand_id);
        await deleteObservations({ shorthand_id: Number(shorthandrow.shorthand_id) });
        await deleteShorthand({ shorthand_id: Number(shorthandrow.shorthand_id) });
      }
      console.log(obsperiod.obsPeriodId);
      await deleteObservationperiod({ obsperiod_id: Number(obsperiod.obsPeriodId) });
    }
    retrieveShorthand(type, location);
    handleClose();
  };


  const handleSave = async () => {
    await handleDelete();
    console.log(sanitizedShorthand);
    setDayId(dayId);
    const rows = sanitizedShorthand;
    await loopThroughObservationPeriods(rows, type, location);
    await loopThroughObservations(rows);
    retrieveShorthand(type, location);
    handleClose();
  };

  const retrieveShorthand = async (type, location) => {
    const res = await getShorthandText(dayId, type, location);
    setDefaultShorthand(res);
    initializeDefaultShorthand(res);
  };


  useEffect(async () => {
    await retrieveShorthand();
  }, [dayId]);


  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setTypes(
        stations
          .find(s => s.observatory === userObservatory)
          .types
      );
    }
  });

  useEffect(() => {
    if (Object.keys(userObservatory).length !== 0) {
      setLocations(
        stations
          .find(s => s.observatory === userObservatory)
          .locations
      );
    }
  });

  console.log("shorthand default: ", defaultShorthand);

  const { t } = useTranslation();

  const user = useSelector(state => state.user);
  const userIsSet = Boolean(user.id);


  const classes = useStyles();

  if (!userIsSet) {
    return (
      <Redirect to="/login" />
    );
  }

  console.log(sanitizedShorthand);

  const errorCheckingLogic = async (editor, data, value) => {
    sanitizedShorthand = loopThroughCheckForErrors(value);
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





  const codemirrorOnchange = (editor, data, value) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      errorCheckingLogic(editor, data, value);
      timeout = null;
    }, 500);
  };

  console.log("shorthand text: ", shorthand);

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
          <Grid
            container
            height="100%"
            alignItems="flex-start"
            spacing={1}>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Location">{t("location")}</InputLabel>
                <Select required
                  labelId="location"
                  id="selectLocation"
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value);
                    retrieveShorthand(type, event.target.value);
                  }}
                >
                  {
                    locations.map((location, i) =>
                      <MenuItem id={location} value={location} key={i}>
                        {location}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl className={classes.formControl}>
                <InputLabel id="Tyyppi">{t("type")}</InputLabel>
                <Select required
                  labelId="type"
                  fullWidth={true}
                  id="selectType"
                  value={type}
                  onChange={(event) => {
                    setType(event.target.value);
                    retrieveShorthand(event.target.value, location);
                  }}
                >
                  {
                    types.map((type, i) =>
                      <MenuItem id={type} value={type} key={i}>
                        {type}
                      </MenuItem>
                    )
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} height="100%">
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
                onChange={codemirrorOnchange}
              />

            </Grid>
            <Grid container item xs={12} alignItems="flex-end">
              <Box pr={2} pt={20}>
                <Button
                  disabled={codeMirrorHasErrors || !shorthand.trim()}
                  variant="contained"
                  color="primary"
                  onClick={handleSave}>
                  {t("save")}
                </Button>
              </Box>
              <Box pr={2} pt={20}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}>
                  {t("cancel")}
                </Button>
              </Box>
              <Box pr={2} pt={20}>
                <Button
                  disabled={deleteButtonIsDisabled()}
                  variant="contained"
                  color="secondary"
                  onClick={handleDialogOpen}>
                  {t("remove")}
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Dialog
            open={warning}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Vahvista poisto"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Poistamista ei voi peruuttaa. Jatketaanko?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogConfirm} color="secondary">
                Vahvista
              </Button>
              <Button onClick={handleDialogClose} color="default" autoFocus>
                Peruuta
              </Button>
            </DialogActions>
          </Dialog>
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