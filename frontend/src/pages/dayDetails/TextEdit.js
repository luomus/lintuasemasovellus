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

const TextEdit = ({ label, defaultValue, onSave }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [editedValue, setEditedValue] = useState("");

  const editClick = useCallback(() => setEditMode(true), []);
  const cancelClick = useCallback(() => setEditMode(false), []);
  const valueChange = useCallback((event) => setEditedValue(event.target.value), []);

  const valueOnSubmit = (event) => {
    event.preventDefault();
    onSave(editedValue);
    setEditMode(false);
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "left"
    }}>
      <Typography variant="h6" component="h2" className={classes.textField}>
        {label}{": "}{defaultValue}{" "}
      </Typography>
      {editMode === false ? (
        <IconButton size="small" onClick={editClick} variant="contained" color="primary" data-cy="edit">
          <Edit fontSize="small"/>
        </IconButton>
      ) : (
        <form onSubmit={valueOnSubmit}>
          <TextField
            className={classes.textField}
            variant="outlined"
            defaultValue={defaultValue}
            onChange={valueChange}
            data-cy="text-field"
          />
          <Button className={classes.button} type="submit" variant="contained" color="primary"
                  data-cy="submit">
            {t("save")}
          </Button>
          <Button className={classes.button} variant="contained" onClick={cancelClick} color="secondary"
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
  onSave: PropTypes.func.isRequired
};

export default TextEdit;
