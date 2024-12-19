import React, {
  useContext,
} from "react";
import {
  Grid,
  Typography, TextField,
  MenuItem,  Accordion,
  AccordionSummary, AccordionDetails, IconButton
} from "@mui/material";
import { Add, ExpandMore } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
import CodeMirrorBlock from "../../../globalComponents/codemirror/CodeMirrorBlock";
import DailyActions from "../../../globalComponents/dayComponents/dailyActions";
import { addOneCatchRow, } from "../../../reducers/catchRowsReducer";
import CatchType from "../../../globalComponents/dayComponents/catchType";
import Notification from "../../../globalComponents/Notification";
import { AppContext } from "../../../AppContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  accordionRoot: {
    width: "100%",
  },
  sectionHeading: {
    fontSize: "20px",
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    opacity: "0.6",
  },
  catchRowEven: {
    backgroundColor: "#f7f7f7",
  }
}
));


export const ObservationFormMainSection = ({ dayList, day, errorsInInput, comment, setComment, type, setType, location, setLocation, shorthand, setShorthand, onSanitizedShorthandChange }) => {
  const classes = useStyles();

  const { t } = useTranslation();
  const { station } = useContext(AppContext);

  const dailyActions = useSelector(state => state.dailyActions);
  const catchRows = useSelector(state => state.catchRows);

  const dispatch = useDispatch();

  const addCatchRow = () => {
    dispatch(addOneCatchRow());
  };

  return (
    <div className={classes.accordionRoot}>
      <br />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore color="primary" />}
          aria-controls="comment-content"
          id="comment-header"
        >
          <Typography className={classes.sectionHeading}>{t("comment")}</Typography>
          <Typography className={classes.secondaryHeading}>{comment ? t("commentAdded") : t("noComment")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            rows={3}
            multiline={true}
            id="comment"
            fullWidth={true}
            label={t("comment")}
            onChange={(event) => setComment(event.target.value)}
            value={comment}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore color="primary" />}
          aria-controls="activity-content"
          id="activity-header"
        >
          <Typography className={classes.sectionHeading}>{t("ObservationActivity")}</Typography>

          <Typography className={classes.secondaryHeading} color={(errorsInInput("dailyactions")) ? "error" : "inherit"}>
            {
              (errorsInInput("dailyactions")) ? t("errorsInObservationActivity")
                : (dailyActions.attachments > "0" || Object.values(dailyActions).includes(true)) ? t("observationActivityAdded")
                  : t("noObservationActivity")
            }
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container
            alignItems="flex-start"
            spacing={1}
            style={{ marginLeft: 0 }}
          >
            <DailyActions />
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore color="primary" />}
          aria-controls="catches-content"
          id="catches-header"
        >
          <Typography className={classes.sectionHeading}>{t("catches")}</Typography>
          <Typography className={classes.secondaryHeading} color={(errorsInInput("catches")) ? "error" : "inherit"}>
            {
              (errorsInInput("catches")) ? t("errorsInCatches")
                : (catchRows.length === 0 || catchRows[0].pyydys === "" || catchRows[0].pyyntialue === "") ? t("noCatches")
                  : t("catchesAdded")
            }
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container
            alignItems="flex-start"
            spacing={1}
          >
            <Notification category="catches" />

            {catchRows.map((cr, i) => (
              i % 2 === 0
                ? (
                  <Grid key={i} id={i} item xs={12}>
                    <CatchType key={cr.key} cr={cr} />
                  </Grid>
                )
                : (
                  <Grid key={i} id={i} item xs={12} className={classes.catchRowEven}>
                    <CatchType key={cr.key} cr={cr} />
                  </Grid>
                )
            ))}

            <Grid item xs={12}>
              <IconButton id="plus-catch-row-button" size="medium" onClick={addCatchRow} variant="contained" color="primary">
                <Add fontSize="default" />
              </IconButton>
              &nbsp; {(catchRows.length === 0) ? t("addRowByClicking") : ""}
            </Grid>
            <Grid item xs={3}>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore color="primary" />}
          aria-controls="obervation-content"
          id="observation-header"
        >
          <Typography className={classes.sectionHeading}>{t("migrantObservations")} *</Typography>
        </AccordionSummary>
        <AccordionDetails>

          <Grid container
            alignItems="flex-start"
            spacing={1}
          >

            <Grid item xs={3}>
              <TextField
                className={classes.formControl}
                select
                required
                fullWidth
                label={t("type")}
                id="selectType"
                slotProps={{
                  select: {
                    value: type,
                    onChange: (event) => setType(event.target.value)
                  }
                }}
              >
                {
                  station.types.map((type, i) =>
                    <MenuItem id={type} value={type} key={i}>
                      {type}
                    </MenuItem>
                  )
                }
              </TextField>
            </Grid>

            <Grid item xs={3}>
              <TextField
                className={classes.formControl}
                select
                required
                fullWidth
                label={t("location")}
                id="selectLocation"
                slotProps={{
                  select: {
                    value: location,
                    onChange: (event) => setLocation(event.target.value)
                  }
                }}
              >
                {
                  station.locations.map((location, i) =>
                    <MenuItem id={location} value={location} key={i}>
                      {location}
                    </MenuItem>
                  )
                }
              </TextField>
            </Grid>

            <Grid item xs={6}>
            </Grid>

            <Grid item xs={12}>
              <CodeMirrorBlock
                dayList={dayList}
                shorthand={shorthand}
                setShorthand={setShorthand}
                setSanitizedShorthand={onSanitizedShorthandChange}
                date={day}
                type={type}
              />
            </Grid>
          </Grid>

        </AccordionDetails>
      </Accordion>
    </div>
  );
};

ObservationFormMainSection.propTypes = {
  dayList: PropTypes.array,
  day: PropTypes.instanceOf(Date).isRequired,
  errorsInInput: PropTypes.func.isRequired,
  comment: PropTypes.string.isRequired,
  setComment: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  setType: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  setLocation: PropTypes.func.isRequired,
  shorthand: PropTypes.string.isRequired,
  setShorthand: PropTypes.func.isRequired,
  onSanitizedShorthandChange: PropTypes.func.isRequired
};
