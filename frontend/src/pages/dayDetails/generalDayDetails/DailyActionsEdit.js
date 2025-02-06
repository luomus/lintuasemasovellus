import React, { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  TextField, Button, IconButton, Typography, FormGroup, FormControlLabel
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CheckCircle, Edit, RemoveCircleOutlineRounded } from "@mui/icons-material";
import { makeStyles, withStyles } from "@mui/styles";
import DailyActions from "../../../globalComponents/dayComponents/dailyActions";
import { setDailyActions } from "../../../reducers/formDataReducer/dailyActionsReducer";
import { editActions } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../../../AppContext";
import { saveData } from "../../../reducers/formStateReducer/saveStateReducer";

const useStyles = makeStyles(theme => ({
  formControlLabel: {
    padding: "0px 100px 0px 0px",
  },
  checkedDailyAction: {
    margin: "11px",
  },
  uncheckedDailyAction: {
    margin: "11px",
  },
  button: {
    marginLeft: "5px",
  },
  attachment: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 75,
  }
})
);

const DisabledTextField = withStyles({
  root: {
    "& .MuiInputBase-root .Mui-disabled": {
      color: "rgba(0, 0, 0, 1)", // (default alpha is 0.38)
      "-webkit-text-fill-color":  "rgba(0, 0, 0, 1)"
    }
  }
})(TextField);

const DailyActionsEdit = ({ dayId }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { observatory } = useContext(AppContext);

  const dailyActions = useSelector(state => state.formData.dailyActions);
  const notifications = useSelector(state => state.formState.notifications);

  const [actionsEditMode, setActionsEditMode] = useState(false);
  const [actionsBeforeEdit, setActionsBeforeEdit] = useState();
  const [errorsInActions, setErrorsInActions] = useState(false);

  useEffect(() => {
    let value = false;
    Object.keys(notifications["dailyactions"]).map(row => {
      if (notifications["dailyactions"][String(row)].errors.length > 0) {
        value = true;
      }
    });
    setErrorsInActions(value);
  }, [notifications]);

  const handleActionsEditOpen = useCallback(() => {
    setActionsBeforeEdit(dailyActions);
    setActionsEditMode(!actionsEditMode);
  }, [actionsEditMode]);

  const handleActionsEditCancel = useCallback(() => {
    dispatch(setDailyActions(actionsBeforeEdit));
    setActionsEditMode(!actionsEditMode);
  }, [observatory, actionsEditMode]);

  const handleActionsEditSave = useCallback(() => {
    let actionsToSave = dailyActions;
    if ("attachments" in actionsToSave) {
      if (actionsToSave.attachments === "" || actionsToSave.attachments < 0) {
        actionsToSave = { ...actionsToSave, "attachments": 0 };
      }
    }
    dispatch(saveData(() => editActions(dayId, JSON.stringify(actionsToSave))));
    setActionsEditMode(!actionsEditMode);
  }, [dayId, dailyActions, actionsEditMode, observatory]);

  return (
    <>
      <Typography variant="h6" component="h2" >
        {t("ObservationActivity")}
      </Typography>
      {(dailyActions && !actionsEditMode) ?
        <FormGroup row className={classes.formGroup}>
          {
            Object.entries(dailyActions).filter(([key]) => key !== "attachments").map(([action, value], i) =>
              <FormControlLabel className={classes.formControlLabel}
                control={value
                  ? <CheckCircle name="check" fontSize="small" className={classes.checkedDailyAction} />
                  : <RemoveCircleOutlineRounded fontSize="small" className={classes.uncheckedDailyAction} />
                }
                label={t(action)} labelPlacement="end" key={i} style={{ cursor: "default" }}
              />
            )
          }
          <FormControlLabel className={classes.FormControlLabel}
            control={<DisabledTextField name="attachments" id="attachments" className={classes.attachment} value={" " + dailyActions.attachments + " " + t("pcs")}
              disabled InputProps={{ disableUnderline: true }} />}
            label={<span style={{ color: "rgba(0, 0, 0, 1)" }}>{t("attachments")}</span>} labelPlacement="start" />

          <IconButton id="actionsButton" size="small" onClick={handleActionsEditOpen} variant="contained" color="primary"  >
            <Edit fontSize="default" />
          </IconButton>
        </FormGroup>
        : <div style={{
          display: "flex",
          alignItems: "left"
        }}>
          <DailyActions />
          <Button id="actionsEditSave" className={classes.button} variant="contained" disabled={errorsInActions} onClick={handleActionsEditSave} color="primary">
            {t("save")}
          </Button>
          <Button id="actionsEditCancel" className={classes.button} variant="contained" onClick={handleActionsEditCancel} color="secondary">
            {t("cancel")}
          </Button>
        </div>
      }
    </>
  );
};

DailyActionsEdit.propTypes = {
  dayId: PropTypes.number.isRequired
};

export default DailyActionsEdit;
