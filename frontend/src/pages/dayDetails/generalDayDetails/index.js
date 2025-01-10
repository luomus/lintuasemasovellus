import React, {useCallback} from "react";
import {Grid} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";

import {editComment, editObservers} from "../../../services";
import TextEdit from "./TextEdit";
import DailyActionsEdit from "./DailyActionsEdit";
import CatchesEdit from "./CatchesEdit";
import {setComment, setObservers} from "../../../reducers/formDataReducer/baseFormDataReducer";


export const GeneralDayDetails = ({ dayId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const observers = useSelector(state => state.formData.baseData.observers);
  const comment = useSelector(state => state.formData.baseData.comment);

  const observersOnSave = useCallback((newObservers) => {
    if (newObservers.length !== 0) {
      dispatch(setObservers(observers));
      editObservers(dayId, newObservers);
    }
  }, [dayId]);

  const commentOnSave = useCallback((newComment) => {
    dispatch(setComment(comment));
    editComment(dayId, newComment);
  }, [dayId]);

  return (
    <Grid container alignItems="flex-end" spacing={3}>
      <Grid item xs={12} fullwidth="true">
        <TextEdit label={t("observers")} defaultValue={observers} onSave={observersOnSave} dataCy="observers"></TextEdit>
        <TextEdit label={t("comment")} defaultValue={comment} onSave={commentOnSave} dataCy="comment"></TextEdit>
      </Grid>

      {/* DAILY ACTIONS */}
      <Grid id="dailyActions" item xs={12} fullwidth="true">
        <DailyActionsEdit dayId={dayId}></DailyActionsEdit>
      </Grid>

      {/* NET ACTIONS */}
      <Grid item xs={12} fullwidth="true">
        <CatchesEdit dayId={dayId}></CatchesEdit>
      </Grid>
    </Grid>
  );
};

GeneralDayDetails.propTypes = {
  dayId: PropTypes.number.isRequired
};
