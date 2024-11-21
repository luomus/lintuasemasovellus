import React from "react";
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

const DailyActionsEdit = ({ catches, editedCatches, errorsInCatches, catchesEditMode, onAddNewCatch, onCatchesEditOpen, onCatchesEditSave, onCatchesEditCancel }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h6" component="h2" >
        {t("catches")}
      </Typography>
      {(catches.length > 0 && !catchesEditMode)
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
                <IconButton id="addCatchButton" size="small" style={{ left: "75px", alignItems: "left" }} onClick={onAddNewCatch} variant="contained" color="primary">
                  <Add fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(catches).map((c) =>
              <TableRow key={catches[String(c)].key}>
                <TableCell component="th" scope="row">{catches[String(c)].pyydys}</TableCell>
                <TableCell align="left" id="catchArea">{catches[String(c)].pyyntialue}</TableCell>
                <TableCell align="left" id="wasOpen">{catches[String(c)].alku} - {catches[String(c)].loppu}</TableCell>
                <TableCell align="left" id="amount">{catches[String(c)].lukumaara}</TableCell>
                <TableCell align="left" id="netCodes">{catches[String(c)].verkkokoodit ? catches[String(c)].verkkokoodit : "-"}</TableCell>
                <TableCell align="left" id="netLength">{catches[String(c)].verkonPituus > 0 ? catches[String(c)].verkonPituus : "-"}</TableCell>
                <TableCell align="left">
                  <IconButton id="catchesButton" size="small" style={{ left: "75px", alignItems: "left" }} data-cache={c} onClick={onCatchesEditOpen} variant="contained" color="primary">
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
            {(editedCatches.length > 0)
              ? /* SHOW CATCH ROW AS EDITABLE ELEMENT */
              <div>
                <Notification category="catches" />
                <CatchType cr={editedCatches[0]} />
                <Button id="catchesEditSave" className={classes.button} variant="contained"
                  onClick={onCatchesEditSave} color="primary"
                  disabled={errorsInCatches}>
                  {t("save")}
                </Button>
                <Button id="catchesEditCancel" className={classes.button} variant="contained" onClick={onCatchesEditCancel} color="secondary">
                  {t("cancel")}
                </Button>
              </div>
              : /* IF ROW-TO-EDIT IS DELETED, SHOW CONFIRMATION */
              <div>
                <Typography variant="body1" color="error" style={{ padding: 5, }}> {t("rowRemoved")}</Typography>
                <Button id="catchesEditSave" className={classes.deleteButton} variant="contained"
                  onClick={onCatchesEditSave}
                  disabled={errorsInCatches}>
                  {t("remove")}
                </Button>
                <Button id="catchesEditCancel" className={classes.button} variant="contained" onClick={onCatchesEditCancel} color="secondary">
                  {t("cancel")}
                </Button>
              </div>
            }
          </div>
          : /* NO CATCHES FOR THAT DAY*/
          <Typography variant="body1"  >
            {t("noCatchesDeclared")}
            <IconButton id="catchesButton" size="small" style={{ left: "75px", alignItems: "left" }} onClick={onAddNewCatch} variant="contained" color="primary"  >
              <Add fontSize="small" />
            </IconButton>
          </Typography>
      }
    </>
  );
};

DailyActionsEdit.propTypes = {
  catches: PropTypes.any.isRequired,
  editedCatches: PropTypes.any.isRequired,
  errorsInCatches: PropTypes.bool.isRequired,
  catchesEditMode: PropTypes.bool.isRequired,
  onAddNewCatch: PropTypes.func.isRequired,
  onCatchesEditOpen: PropTypes.func.isRequired,
  onCatchesEditSave: PropTypes.func.isRequired,
  onCatchesEditCancel: PropTypes.func.isRequired,
};

export default DailyActionsEdit;
