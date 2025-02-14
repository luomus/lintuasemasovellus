import React, { memo } from "react";
import { Grid, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import Notification from "../Notification";
import CatchRow from "./catchRow";
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getNewCatchRow } from "../../services";

const useStyles = makeStyles(() => ({
  catchRowEven: {
    backgroundColor: "#f7f7f7",
  }
}));

const CatchRows = ({ value, onChange }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const addCatchRow = () => {
    const key = value.length > 0 ? value[value.length - 1].key + 1 : 1;
    onChange([...value, getNewCatchRow(key)]);
  };

  const updateCatchRow = (i, cr) => {
    const newValue = [...value];
    newValue[i] = cr;
    onChange(newValue);
  };

  const deleteCatchRow = (i) => {
    onChange([...value.slice(0, i), ...value.slice(i + 1)]);
  };

  return (
    <Grid
      container
      alignItems="flex-start"
      spacing={1}
    >
      <Notification category="catches" />

      {value.map((cr, i) => (
        <Grid key={i} id={i} item xs={12} className={i % 2 === 0 ? classes.catchRowEven : ""}>
          <CatchRow key={cr.key} value={cr} onChange={(cr) => updateCatchRow(i, cr)} onDelete={() => deleteCatchRow(i)} catchRows={value} />
        </Grid>
      ))}

      <Grid item xs={12}>
        <IconButton id="plus-catch-row-button" size="medium" onClick={addCatchRow} variant="contained" color="primary">
          <Add fontSize="default" />
        </IconButton>
        &nbsp; {(value.length === 0) ? t("addRowByClicking") : ""}
      </Grid>
      <Grid item xs={3}>
      </Grid>
    </Grid>
  );
};

CatchRows.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

export default memo(CatchRows);
