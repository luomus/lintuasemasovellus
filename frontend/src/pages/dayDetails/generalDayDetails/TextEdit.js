import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  TextField, Button, IconButton, Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  textField: {
    marginRight: "5px",
    marginBottom: "5px",
  },
  button: {
    marginLeft: "5px",
  }
})
);

const TextEdit = ({ label, defaultValue, onSave, dataCy, disabled }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [editedValue, setEditedValue] = useState("");

  const editClick = useCallback(() => setEditMode(true), []);
  const cancelClick = useCallback(() => setEditMode(false), []);
  const valueChange = useCallback((event) => setEditedValue(event.target.value), []);

  const valueOnSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSave(editedValue);
      setEditMode(false);
    } catch (e) {
      // error handled in saveData
    }
  };

  return (
    <div data-cy={dataCy} style={{
      display: "flex",
      alignItems: "left"
    }}>
      <Typography variant="h6" component="h2" className={classes.textField}>
        {label}{": "}{defaultValue}{" "}
      </Typography>
      {editMode === false ? (
        <IconButton size="small" onClick={editClick} variant="contained" color="primary" data-cy="edit" disabled={disabled}>
          <Edit fontSize="small"/>
        </IconButton>
      ) : (
        <form onSubmit={valueOnSubmit}>
          <TextField
            className={classes.textField}
            variant="outlined"
            defaultValue={defaultValue}
            onChange={valueChange}
          />
          <Button className={classes.button} type="submit" variant="contained" color="primary" disabled={disabled}
            data-cy="submit">
            {t("save")}
          </Button>
          <Button className={classes.button} variant="contained" onClick={cancelClick} color="secondary" disabled={disabled}
            data-cy="cancel">
            {t("cancel")}
          </Button>
        </form>
      )}
    </div>
  );
};

TextEdit.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  dataCy: PropTypes.string,
  disabled: PropTypes.bool
};

export default TextEdit;
