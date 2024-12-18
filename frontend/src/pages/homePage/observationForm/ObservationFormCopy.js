import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Modal,
  Tooltip
} from "@mui/material";
import { FileCopy } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
  formControlLabel: {
    padding: "0px 100px 0px 0px",
  }
}
));

export const ObservationFormCopy = ({ day, onCopyDay }) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [openCopy, setOpenCopy] = useState(false);
  const [toCopy, setToCopy] = useState({
    "observers": false, "comment": false,
    "observationActivity": false, "catches": false
  });

  const handleCopyConfirm = () => {
    let previousDay = new Date(day);
    previousDay.setDate(day.getDate() - 1);
    onCopyDay(previousDay, toCopy);
    handleCopyClose();
  };

  const handleCopyClose = () => {
    setToCopy({
      "observers": false, "comment": false,
      "observationActivity": false, "catches": false
    });
    setOpenCopy(false);
  };

  const handleOpenCopy = () => {
    setOpenCopy(true);
  };

  const handleCopyChange = (name) => {
    setToCopy({ ...toCopy, [name]: !toCopy[String(name)] });
  };

  return (
    <>
      <Tooltip title={t("copy")}>
        <IconButton id="open-copy-button" size="medium" onClick={handleOpenCopy} variant="contained" color="primary">
          <FileCopy fontSize="default" />
        </IconButton>
      </Tooltip>
      <Modal
        open={openCopy}
        onClose={handleCopyClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Dialog
          open={openCopy}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t("copy")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("chooseCopy")} <br />
              {t("overwrite")}
            </DialogContentText>
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-observers-box" checked={toCopy.observers} onChange={(event) => handleCopyChange(event.target.name)} name="observers" color="primary" className={classes.checkbox} />}
              label={t("observers")} labelPlacement="end" />
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-comment-box" checked={toCopy.comment} onChange={(event) => handleCopyChange(event.target.name)} name="comment" color="primary" className={classes.checkbox} />}
              label={t("comment")} labelPlacement="end" />
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-activity-box" checked={toCopy.observationActivity} onChange={(event) => handleCopyChange(event.target.name)} name="observationActivity" color="primary" className={classes.checkbox} />}
              label={t("ObservationActivity")} labelPlacement="end" />
            <br />
            <FormControlLabel className={classes.formControlLabel}
              control={<Checkbox id="copy-catches-box" checked={toCopy.catches} onChange={(event) => handleCopyChange(event.target.name)} name="catches" color="primary" className={classes.checkbox} />}
              label={t("catches")} labelPlacement="end" />
          </DialogContent>
          <DialogActions>
            <Button id="confirm-copy-button" onClick={handleCopyConfirm} color="primary" variant="contained">
              {t("confirm")}
            </Button>
            <Button id="cancel-copy-button" onClick={handleCopyClose} color="secondary" variant="contained" autoFocus>
              {t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>
    </>
  );
};

ObservationFormCopy.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  onCopyDay: PropTypes.func.isRequired
};
