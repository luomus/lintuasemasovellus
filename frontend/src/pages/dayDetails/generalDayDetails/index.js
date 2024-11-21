import React, { useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { setDefaultActions, setDailyActions } from "../../../reducers/dailyActionsReducer";
import { setCatches, addOneCatchRow, setNewCatchRow } from "../../../reducers/catchRowsReducer";
import { resetNotifications } from "../../../reducers/notificationsReducer";

import {
  editComment, editObservers, editActions, getCatches, editCatchRow, deleteCatchRow
} from "../../../services";
import TextEdit from "./TextEdit";
import DailyActionsEdit from "./DailyActionsEdit";
import CatchesEdit from "./CatchesEdit";


export const GeneralDayDetails = ({ userObservatory, thisDay }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const notifications = useSelector(state => state.notifications);
  const editedActions = useSelector(state => state.dailyActions);
  const editedCatches = useSelector(state => state.catchRows);

  const [actionsEditMode, setActionsEditMode] = useState(false);
  const [catchesEditMode, setCatchesEditMode] = useState(false);
  const [addingNewRowMode, setAddingNewRowMode] = useState(false);
  const [catches, setDayCatches] = useState([]);
  const [catchRowToEdit, setCatchRowToEdit] = useState({});
  const [dayId, setDayId] = useState();
  const [observers, setObservers] = useState();
  const [comment, setComment] = useState();
  const [selectedActions, setSelectedActions] = useState();
  const [errorsInCatches, setErrorsInCacthes] = useState(false);
  const [errorsInActions, setErrorsInActions] = useState(false);


  useEffect(() => {
    if (thisDay) {
      setDayId(thisDay.id);
      setObservers(thisDay.observers);
      setComment(thisDay.comment);
      setSelectedActions(thisDay.selectedactions
        ? JSON.parse(thisDay.selectedactions)
        : {});
    } else {
      setDayId(null);
      setObservers(null);
      setComment(null);
      setSelectedActions(null);
    }
  }, [thisDay]);

  useEffect(() => {
    if (dayId !== undefined && dayId !== null) {
      getCatches(dayId)
        .then(res => setDayCatches(res));
    }
  }, [dayId]);

  useEffect(() => {
    let value = false;
    Object.keys(notifications["catches"]).map(row => {
      if (notifications["catches"][String(row)].errors.length > 0) {
        value = true;
      }
    });
    Object.keys(editedCatches).map(row => {
      if (editedCatches[String(row)].lukumaara === 0) {
        value = true;
      }
    });
    setErrorsInCacthes(value);
  }, [notifications, editedCatches]);

  useEffect(() => {
    let value = false;
    Object.keys(notifications["dailyactions"]).map(row => {
      if (notifications["dailyactions"][String(row)].errors.length > 0) {
        value = true;
      }
    });
    setErrorsInActions(value);
  }, [notifications]);

  const observersOnSave = useCallback((newObservers) => {
    if (newObservers.length !== 0) {
      setObservers(newObservers);
      editObservers(dayId, newObservers)
        .then(dayJson => setDayId(dayJson.data.id));
    }
  }, [dayId]);

  const commentOnSave = useCallback((newComment) => {
    setComment(newComment);
    editComment(dayId, newComment)
      .then(dayJson => setDayId(dayJson.data.id));
  }, [dayId]);

  const handleActionsEditOpen = useCallback(() => {
    dispatch(setDailyActions(selectedActions));
    setActionsEditMode(!actionsEditMode);
  }, [selectedActions, actionsEditMode]);

  const handleActionsEditCancel = useCallback(() => {
    dispatch(setDefaultActions(userObservatory));
    setActionsEditMode(!actionsEditMode);
  }, [userObservatory, actionsEditMode]);

  const handleActionsEditSave = useCallback(() => {
    let actionsToSave = editedActions;
    if ("attachments" in actionsToSave) {
      if (actionsToSave.attachments === "" || actionsToSave.attachments < 0) {
        actionsToSave = { ...actionsToSave, "attachments": 0 };
      }
    }
    editActions(dayId, JSON.stringify(actionsToSave))
      .then(dayJson => setDayId(dayJson.data.id));
    setSelectedActions(actionsToSave);
    setActionsEditMode(!actionsEditMode);
    dispatch(setDefaultActions(userObservatory));
  }, [dayId, editedActions, actionsEditMode, userObservatory]);

  const handleCatchesEditOpen = useCallback((event) => {
    const c = event.currentTarget.getAttribute('data-cache');
    const key = catches[c].key;
    // send info to reducer
    dispatch(resetNotifications());
    const row = catches.filter(c => c.key === key);
    setCatchRowToEdit(row[0]);
    dispatch(setCatches(row));
    setCatchesEditMode(!actionsEditMode);
  }, [catches, actionsEditMode]);

  const handleCatchesEditCancel = useCallback(() => {
    setCatchRowToEdit({});
    dispatch(setCatches([]));
    dispatch(resetNotifications());
    setCatchesEditMode(false);
    setAddingNewRowMode(false);
  }, []);

  const handleAddNewCatch = useCallback(() => {
    setAddingNewRowMode(true);
    if (catches.length === 0) {
      dispatch(setNewCatchRow());
    } else {
      const maxKey = Math.max.apply(Math, catches.map(row => row.key));
      dispatch(addOneCatchRow(maxKey + 1));
    }
    dispatch(resetNotifications());
    setCatchesEditMode(true);
  }, [catches]);

  const handleCatchesEditSave = useCallback(() => {
    if (editedCatches.length === 0) {
      if (catchRowToEdit.key) {
        deleteCatchRow(dayId, catchRowToEdit);
        setDayCatches(catches.filter(row => row.key !== catchRowToEdit.key));
      }
    } else {
      editCatchRow(dayId, editedCatches);
      if (addingNewRowMode) {
        setDayCatches([...catches, editedCatches[0]]);
      } else {
        setDayCatches(catches.map(row => row.key === editedCatches[0].key
          ? editedCatches[0]
          : row));
      }
    }
    dispatch(setCatches([]));
    setCatchRowToEdit({});
    dispatch(resetNotifications());
    setCatchesEditMode(false);
    setAddingNewRowMode(false);
  }, [dayId, editedCatches, catches, catchRowToEdit, addingNewRowMode]);

  return (
    <Grid container alignItems="flex-end" spacing={3}>
      <Grid item xs={12} fullwidth="true">
        <TextEdit label={t("observers")} defaultValue={observers} onSave={observersOnSave} data-cy="observers"></TextEdit>
        <TextEdit label={t("comment")} defaultValue={comment} onSave={commentOnSave} data-cy="comment"></TextEdit>
      </Grid>

      {/* DAILY ACTIONS */}
      <Grid id="dailyActions" item xs={12} fullwidth="true">
        <DailyActionsEdit
          selectedActions={selectedActions}
          errorsInActions={errorsInActions}
          actionsEditMode={actionsEditMode}
          onActionsEditOpen={handleActionsEditOpen}
          onActionsEditSave={handleActionsEditSave}
          onActionsEditCancel={handleActionsEditCancel}
        ></DailyActionsEdit>
      </Grid>

      {/* NET ACTIONS */}
      <Grid item xs={12} fullwidth="true">
        <CatchesEdit
          catches={catches}
          editedCatches={editedCatches}
          errorsInCatches={errorsInCatches}
          catchesEditMode={catchesEditMode}
          onAddNewCatch={handleAddNewCatch}
          onCatchesEditOpen={handleCatchesEditOpen}
          onCatchesEditSave={handleCatchesEditSave}
          onCatchesEditCancel={handleCatchesEditCancel}
        ></CatchesEdit>
      </Grid>
    </Grid>
  );
};

GeneralDayDetails.propTypes = {
  userObservatory: PropTypes.string.isRequired,
  thisDay: PropTypes.any.isRequired
};
