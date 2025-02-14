import React, { memo, useCallback, useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {
  deleteCatchRow,
  editActions,
  editCatchRow,
  editComment,
  editObservers,
  stringifyDailyActions
} from "../../../services";
import TextEdit from "./TextEdit";
import DailyActionsEdit from "./DailyActionsEdit";
import CatchesEdit from "./CatchesEdit";
import { saveData } from "../../../reducers/savingStateReducer";


const GeneralDayDetails = ({ dayId, initialData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [observers, setObservers] = useState(initialData.observers);
  const [comment, setComment] = useState(initialData.comment);
  const [dailyActions, setDailyActions] = useState(initialData.dailyActions);
  const [catchRows, setCatchRows] = useState(initialData.catchRows);

  const observersOnSave = useCallback((newObservers) => {
    if (newObservers.length !== 0) {
      setObservers(newObservers);
      dispatch(saveData(() => editObservers(dayId, newObservers)));
    }
  }, [dayId]);

  const commentOnSave = useCallback((newComment) => {
    setComment(newComment);
    dispatch(saveData(() => editComment(dayId, newComment)));
  }, [dayId]);

  const saveCatch = useCallback((cr) => {
    dispatch(saveData(() => editCatchRow(dayId, [cr])));
  }, [dayId]);

  const deleteCatch = useCallback((key) => {
    dispatch(saveData(() => deleteCatchRow(dayId, key)));
  }, [dayId]);

  const saveDailyActions = useCallback((actions) => {
    dispatch(saveData(() => editActions(dayId, stringifyDailyActions(actions))));
  }, [dayId]);

  return (
    <Grid container alignItems="flex-end" spacing={3}>
      <Grid item xs={12} fullwidth="true">
        <TextEdit label={t("observers")} defaultValue={observers} onSave={observersOnSave} dataCy="observers"></TextEdit>
        <TextEdit label={t("comment")} defaultValue={comment} onSave={commentOnSave} dataCy="comment"></TextEdit>
      </Grid>

      {/* DAILY ACTIONS */}
      <Grid id="dailyActions" item xs={12} fullwidth="true">
        <DailyActionsEdit
          value={dailyActions}
          onChange={setDailyActions}
          onSave={saveDailyActions}
          catchRows={catchRows}
        />
      </Grid>

      {/* NET ACTIONS */}
      <Grid item xs={12} fullwidth="true">
        <CatchesEdit
          value={catchRows}
          onChange={setCatchRows}
          onSaveRow={saveCatch}
          onDeleteRow={deleteCatch}
        />
      </Grid>
    </Grid>
  );
};

GeneralDayDetails.propTypes = {
  dayId: PropTypes.number.isRequired,
  initialData: PropTypes.object.isRequired
};

export default memo(GeneralDayDetails);
