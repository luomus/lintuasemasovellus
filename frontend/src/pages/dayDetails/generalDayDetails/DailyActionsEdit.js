import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  TextField, Button, IconButton, Typography, FormGroup, FormControlLabel
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CheckCircle, Edit, RemoveCircleOutlineRounded } from "@mui/icons-material";
import { makeStyles, withStyles } from "@mui/styles";
import DailyActions from "../../../globalComponents/dayComponents/dailyActions";
import { useSelector } from "react-redux";
import { AppContext } from "../../../AppContext";

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

const DailyActionsEdit = ({ value, onChange, onSave, catchRows }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { observatory } = useContext(AppContext);

  const notifications = useSelector(state => state.notifications);

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
    setActionsBeforeEdit(value);
    setActionsEditMode(!actionsEditMode);
  }, [actionsEditMode]);

  const handleActionsEditCancel = useCallback(() => {
    onChange(actionsBeforeEdit);
    setActionsEditMode(!actionsEditMode);
  }, [observatory, actionsEditMode]);

  const handleActionsEditSave = useCallback(() => {
    onSave(value);
    setActionsEditMode(!actionsEditMode);
  }, [value, actionsEditMode, observatory]);

  return (
    <>
      <Typography variant="h6" component="h2" >
        {t("ObservationActivity")}
      </Typography>
      {!actionsEditMode &&
        <FormGroup row className={classes.formGroup}>
          {
            Object.entries(value).filter(([key]) => key !== "attachments").map(([action, value], i) =>
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
            control={<DisabledTextField name="attachments" id="attachments" className={classes.attachment} value={" " + value.attachments + " " + t("pcs")}
              disabled InputProps={{ disableUnderline: true }} />}
            label={<span style={{ color: "rgba(0, 0, 0, 1)" }}>{t("attachments")}</span>} labelPlacement="start" />

          <IconButton id="actionsButton" size="small" onClick={handleActionsEditOpen} variant="contained" color="primary"  >
            <Edit fontSize="default" />
          </IconButton>
        </FormGroup>
      }
      <div style={{
        display: actionsEditMode ? "flex" : "none",
        alignItems: "left"
      }}>
        <DailyActions value={value} onChange={onChange} catchRows={catchRows} />
        <Button id="actionsEditSave" className={classes.button} variant="contained" disabled={errorsInActions} onClick={handleActionsEditSave} color="primary">
          {t("save")}
        </Button>
        <Button id="actionsEditCancel" className={classes.button} variant="contained" onClick={handleActionsEditCancel} color="secondary">
          {t("cancel")}
        </Button>
      </div>
    </>
  );
};

DailyActionsEdit.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  catchRows: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default memo(DailyActionsEdit);
