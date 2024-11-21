import React from "react";
import PropTypes from "prop-types";
import {
  TextField, Button, IconButton, Typography, FormGroup, FormControlLabel, Box
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CheckCircle, Edit, RemoveCircleOutlineRounded } from "@mui/icons-material";
import { makeStyles, withStyles } from "@mui/styles";
import DailyActions from "../../../globalComponents/dayComponents/dailyActions";

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

const DailyActionsEdit = ({ selectedActions, errorsInActions, actionsEditMode, onActionsEditOpen, onActionsEditCancel, onActionsEditSave }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" component="h2" >
        {t("ObservationActivity")}
      </Typography>
      {(selectedActions && !actionsEditMode) ?
        <FormGroup row className={classes.formGroup}>
          {
            Object.entries(selectedActions).filter(([key]) => key !== "attachments").map(([action, value], i) =>
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
            control={<DisabledTextField name="attachments" id="attachments" className={classes.attachment} value={" " + selectedActions.attachments + " " + t("pcs")}
              disabled InputProps={{ disableUnderline: true }} />}
            label={<span style={{ color: "rgba(0, 0, 0, 1)" }}>{t("attachments")}</span>} labelPlacement="start" />

          <Box>
            <IconButton id="actionsButton" size="small" style={{ left: "100px", alignItems: "left" }} onClick={onActionsEditOpen} variant="contained" color="primary"  >
              <Edit fontSize="default" />
            </IconButton>
          </Box>
        </FormGroup>
        : <div style={{
          display: "flex",
          alignItems: "left"
        }}>
          <DailyActions />
          <Button id="actionsEditSave" className={classes.button} variant="contained" disabled={errorsInActions} onClick={onActionsEditSave} color="primary">
            {t("save")}
          </Button>
          <Button id="actionsEditCancel" className={classes.button} variant="contained" onClick={onActionsEditCancel} color="secondary">
            {t("cancel")}
          </Button>
        </div>
      }
    </>
  );
};

DailyActionsEdit.propTypes = {
  selectedActions: PropTypes.any,
  errorsInActions: PropTypes.bool.isRequired,
  actionsEditMode: PropTypes.bool.isRequired,
  onActionsEditOpen: PropTypes.func.isRequired,
  onActionsEditCancel: PropTypes.func.isRequired,
  onActionsEditSave: PropTypes.func.isRequired
};

export default DailyActionsEdit;
