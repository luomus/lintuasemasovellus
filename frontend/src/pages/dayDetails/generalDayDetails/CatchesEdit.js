import React, { useCallback, useEffect, useState } from "react";
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
import CatchType from "../../../globalComponents/dayComponents/catchType";
import { resetNotifications } from "../../../reducers/notificationsReducer";
import { addOneCatchRow, setCatches } from "../../../reducers/formDataReducer/catchRowsReducer";
import { deleteCatchRow, editCatchRow } from "../../../services";
import { useDispatch, useSelector } from "react-redux";

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

const CatchesEdit = ({ dayId }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const catchRows = useSelector(state => state.formData.catchRows);
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
    Object.keys(catchRows).map(row => {
      if (catchRows[String(row)].lukumaara === 0) {
        value = true;
      }
    });
    setErrorsInCaches(value);
  }, [notifications, catchRows]);

  const handleCatchesEditOpen = useCallback((event) => {
    const c = event.currentTarget.getAttribute("data-cache");
    const key = catchRows[c].key;
    setCachesBeforeEdit(catchRows);
    setCatchRowKeyToEdit(key);
    setCatchesEditMode(true);
  }, [catchRows]);

  const handleCatchesEditCancel = useCallback(() => {
    dispatch(setCatches(catchesBeforeEdit));
    dispatch(resetNotifications());
    setCatchesEditMode(false);
  }, [catchesBeforeEdit]);

  const handleAddNewCatch = useCallback(() => {
    const maxKey = catchRows.length === 0 ? 0 : Math.max.apply(Math, catchRows.map(row => row.key));
    const newKey = maxKey + 1;
    setCachesBeforeEdit(catchRows);
    setCatchRowKeyToEdit(newKey);
    setCatchesEditMode(true);
    dispatch(addOneCatchRow(newKey));
  }, [catchRows]);

  const handleCatchesEditSave = useCallback(() => {
    const catchRow = catchRows.filter(row => row.key === catchRowKeyToEdit)[0];
    if (!catchRow) {
      if (catchesBeforeEdit.some(row => row.key === catchRowKeyToEdit)) {
        deleteCatchRow(dayId, catchRowKeyToEdit);
      }
    } else {
      editCatchRow(dayId, [catchRow]);
    }

    dispatch(resetNotifications());
    setCatchesEditMode(false);
  }, [dayId, catchRows, catchRowKeyToEdit]);

  const cr = catchRows.filter(row => row.key === catchRowKeyToEdit)[0];

  return (
    <>
      <Typography variant="h6" component="h2" >
        {t("catches")}
      </Typography>
      {(catchRows.length > 0 && !catchesEditMode)
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
            {Object.keys(catchRows).map((c) =>
              <TableRow key={catchRows[String(c)].key}>
                <TableCell component="th" scope="row">{catchRows[String(c)].pyydys}</TableCell>
                <TableCell align="left" id="catchArea">{catchRows[String(c)].pyyntialue}</TableCell>
                <TableCell align="left" id="wasOpen">{catchRows[String(c)].alku} - {catchRows[String(c)].loppu}</TableCell>
                <TableCell align="left" id="amount">{catchRows[String(c)].lukumaara}</TableCell>
                <TableCell align="left" id="netCodes">{catchRows[String(c)].verkkokoodit ? catchRows[String(c)].verkkokoodit : "-"}</TableCell>
                <TableCell align="left" id="netLength">{catchRows[String(c)].verkonPituus > 0 ? catchRows[String(c)].verkonPituus : "-"}</TableCell>
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
                <Notification category="catches" />
                <CatchType cr={cr} />
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
  dayId: PropTypes.number.isRequired
};

export default CatchesEdit;
