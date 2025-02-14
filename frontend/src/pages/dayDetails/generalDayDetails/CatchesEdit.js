import React, { memo, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  IconButton,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Add, Edit } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import Notification from "../../../globalComponents/Notification";
import CatchRow from "../../../globalComponents/dayComponents/catchRow";
import { getNewCatchRow } from "../../../services";
import { useSelector } from "react-redux";

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: "5px",
  },
  catchTable: {
    maxWidth: "65%",
  },
  deleteButton: {
    marginLeft: "5px",
    color: "white",
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  }
})
);

const CatchesEdit = ({ value, onChange, onSaveRow, onDeleteRow }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const notifications = useSelector(state => state.notifications);

  const [catchesEditMode, setCatchesEditMode] = useState(false);
  const [catchesBeforeEdit, setCachesBeforeEdit] = useState();
  const [catchRowKeyToEdit, setCatchRowKeyToEdit] = useState();
  const [errorsInCatches, setErrorsInCaches] = useState(false);

  useEffect(() => {
    let value = false;
    Object.keys(notifications["catches"]).map(row => {
      if (notifications["catches"][String(row)].errors.length > 0) {
        value = true;
      }
    });
    Object.keys(value).map(row => {
      if (value[String(row)].lukumaara === 0) {
        value = true;
      }
    });
    setErrorsInCaches(value);
  }, [notifications, value]);

  const handleCatchesEditOpen = useCallback((event) => {
    const c = event.currentTarget.getAttribute("data-cache");
    const key = value[c].key;
    setCachesBeforeEdit(value);
    setCatchRowKeyToEdit(key);
    setCatchesEditMode(true);
  }, [value]);

  const handleCatchesEditCancel = useCallback(() => {
    onChange(catchesBeforeEdit);
    setCatchesEditMode(false);
  }, [catchesBeforeEdit]);

  const handleAddNewCatch = useCallback(() => {
    const maxKey = value.length === 0 ? 0 : Math.max.apply(Math, value.map(row => row.key));
    const newKey = maxKey + 1;
    setCachesBeforeEdit(value);
    setCatchRowKeyToEdit(newKey);
    setCatchesEditMode(true);
    onChange([...value, getNewCatchRow(newKey)]);
  }, [value]);

  const handleCatchesEditSave = useCallback(() => {
    const catchRow = value.filter(row => row.key === catchRowKeyToEdit)[0];
    if (!catchRow) {
      if (catchesBeforeEdit.some(row => row.key === catchRowKeyToEdit)) {
        onDeleteRow(catchRowKeyToEdit);
      }
    } else {
      onSaveRow(catchRow);
    }

    setCatchesEditMode(false);
  }, [value, catchRowKeyToEdit]);

  const catchRowUpdate = useCallback((cr) => {
    const newRows = value.map(row => {
      if (row.key === catchRowKeyToEdit) {
        return cr;
      }
      return row;
    });
    onChange(newRows);
  }, [value]);

  const catchRowDelete = useCallback(() => {
    onChange(value.filter(row => row.key !== catchRowKeyToEdit));
  }, [value]);

  const cr = value.filter(row => row.key === catchRowKeyToEdit)[0];

  return (
    <>
      <Typography variant="h6" component="h2" >
        {t("catches")}
      </Typography>
      {(value.length > 0 && !catchesEditMode)
        ? /* LIST CATCHES */
        <Table className={classes.catchTable} size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>{t("catchType")}</TableCell>
              <TableCell align="left">{t("catchArea")}</TableCell>
              <TableCell align="left">{t("wasOpen")}</TableCell>
              <TableCell align="left">{t("amount")}</TableCell>
              <TableCell align="left">{t("netCodes")}</TableCell>
              <TableCell align="left">{t("length")}</TableCell>
              <TableCell align="left">
                <IconButton id="addCatchButton" size="small" style={{ left: "75px", alignItems: "left" }} onClick={handleAddNewCatch} variant="contained" color="primary">
                  <Add fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(value).map((c) =>
              <TableRow key={value[String(c)].key}>
                <TableCell component="th" scope="row">{value[String(c)].pyydys}</TableCell>
                <TableCell align="left" id="catchArea">{value[String(c)].pyyntialue}</TableCell>
                <TableCell align="left" id="wasOpen">{value[String(c)].alku} - {value[String(c)].loppu}</TableCell>
                <TableCell align="left" id="amount">{value[String(c)].lukumaara}</TableCell>
                <TableCell align="left" id="netCodes">{value[String(c)].verkkokoodit ? value[String(c)].verkkokoodit : "-"}</TableCell>
                <TableCell align="left" id="netLength">{value[String(c)].verkonPituus > 0 ? value[String(c)].verkonPituus : "-"}</TableCell>
                <TableCell align="left">
                  <IconButton id="catchesButton" size="small" style={{ left: "75px", alignItems: "left" }} data-cache={c} onClick={handleCatchesEditOpen} variant="contained" color="primary">
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        : (catchesEditMode) /* EDIT ONE CATCH ROW */
          ?
          <div>
            {cr
              ? /* SHOW CATCH ROW AS EDITABLE ELEMENT */
              <div>
                <Notification category="catches" keys={[String(cr.key), "standardCatch"]} />
                <CatchRow value={cr} onChange={catchRowUpdate} onDelete={catchRowDelete} catchRows={value} />
                <Button id="catchesEditSave" className={classes.button} variant="contained"
                  onClick={handleCatchesEditSave} color="primary"
                  disabled={errorsInCatches}>
                  {t("save")}
                </Button>
                <Button id="catchesEditCancel" className={classes.button} variant="contained" onClick={handleCatchesEditCancel} color="secondary">
                  {t("cancel")}
                </Button>
              </div>
              : /* IF ROW-TO-EDIT IS DELETED, SHOW CONFIRMATION */
              <div>
                <Notification category="catches" keys={["standardCatch"]} />
                <Typography variant="body1" color="error" style={{ padding: 5, }}> {t("rowRemoved")}</Typography>
                <Button id="catchesEditSave" className={classes.deleteButton} variant="contained"
                  onClick={handleCatchesEditSave}
                  disabled={errorsInCatches}>
                  {t("remove")}
                </Button>
                <Button id="catchesEditCancel" className={classes.button} variant="contained" onClick={handleCatchesEditCancel} color="secondary">
                  {t("cancel")}
                </Button>
              </div>
            }
          </div>
          : /* NO CATCHES FOR THAT DAY*/
          <Typography variant="body1"  >
            {t("noCatchesDeclared")}
            <IconButton id="catchesButton" size="small" style={{ left: "75px", alignItems: "left" }} onClick={handleAddNewCatch} variant="contained" color="primary"  >
              <Add fontSize="small" />
            </IconButton>
          </Typography>
      }
    </>
  );
};

CatchesEdit.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  onSaveRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};

export default memo(CatchesEdit);
