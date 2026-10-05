import React, { memo, useCallback, useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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

  const saving = useSelector(state => state.savingState.saving);

  const [observers, setObservers] = useState(initialData.observers);
  const [comment, setComment] = useState(initialData.comment);
  const [dailyActions, setDailyActions] = useState(initialData.dailyActions);
  const [catchRows, setCatchRows] = useState(initialData.catchRows);

  const observersOnSave = useCallback(async (newObservers) => {
    if (newObservers.length !== 0) {
      await dispatch(saveData(() => editObservers(dayId, newObservers)));
      setObservers(newObservers);
    }
  }, [dayId, dispatch]);

  const commentOnSave = useCallback(async (newComment) => {
    await dispatch(saveData(() => editComment(dayId, newComment)));
    setComment(newComment);
  }, [dayId, dispatch]);

  const saveCatch = useCallback(async (cr) => {
    await dispatch(saveData(() => editCatchRow(dayId, [cr])));
  }, [dayId, dispatch]);

  const deleteCatch = useCallback(async (key) => {
    await dispatch(saveData(() => deleteCatchRow(dayId, key)));
  }, [dayId, dispatch]);

  const saveDailyActions = useCallback(async (actions) => {
    await dispatch(saveData(() => editActions(dayId, stringifyDailyActions(actions))));
  }, [dayId, dispatch]);

  return (
    <Grid container alignItems="flex-end" spacing={3}>
      <Grid item xs={12} fullwidth="true">
        <TextEdit label={t("observers")} defaultValue={observers} onSave={observersOnSave} dataCy="observers" disabled={saving}></TextEdit>
        <TextEdit label={t("comment")} defaultValue={comment} onSave={commentOnSave} dataCy="comment" disabled={saving}></TextEdit>
      </Grid>

      {/* DAILY ACTIONS */}
      <Grid id="dailyActions" item xs={12} fullwidth="true">
        <DailyActionsEdit
          value={dailyActions}
          onChange={setDailyActions}
          onSave={saveDailyActions}
          catchRows={catchRows}
          disabled={saving}
        />
      </Grid>

      {/* NET ACTIONS */}
      <Grid item xs={12} fullwidth="true">
        <CatchesEdit
          value={catchRows}
          onChange={setCatchRows}
          onSaveRow={saveCatch}
          onDeleteRow={deleteCatch}
          disabled={saving}
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
