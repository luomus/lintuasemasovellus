import React from "react";//
import {
  Typography, Grid, Paper, List, ListItem
} from "@material-ui/core/";
import WarningIcon from "@material-ui/icons/Warning";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    padding: "5px",
    borderRadius: 3,
  },
  errorPaper: {
    background: "#f5f890",
    padding: "20px 30px",
    marginTop: "20px",
    maxHeight: "8vw",
    overflow: "auto",
  },
  errorHeading: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

const Notification = ({ category="all" }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  let allNotifications = useSelector(state => state.notifications);
  let notificationsSet = new Set();
  let errorsSet = new Set();

  Object.keys(allNotifications).map(cat => {
    if (cat === category || category === "all") {
      Object.keys(allNotifications[String(cat)]).map(i => {
        allNotifications[String(cat)][String(i)].notifications.forEach(n => notificationsSet.add(n));
        allNotifications[String(cat)][String(i)].errors.forEach(e => errorsSet.add(e));
      });
    }
  });

  const notifications = [... notificationsSet];
  const errors = [... errorsSet];

  if (category === "shorthand") {
    return (
      <div>
        { errors.length > 0 &&
          <Paper className={classes.errorPaper} >
            <Grid item xs={12}>
              <Typography variant="h5" component="h2" className={classes.errorHeading} >
                <WarningIcon fontSize="inherit" />&nbsp;&nbsp;
                {t("checkShorthand")}
              </Typography>
              <List>
                { errors.map((e, i) => (
                  <ListItem key={i}>
                    {e}
                  </ListItem>
                ))
                }
              </List>
            </Grid>
          </Paper>
        }
      </div>
    );
  }

  return (
    <Grid item xs={12} >
      { errors.length > 0 &&
        errors.map((e, i) => (
          <Typography className={classes.container} key={i} variant="subtitle2" color="error">{e}</Typography>
        ))
      }
      { notifications.length > 0 &&
        notifications.map((n, i) => (
          <Typography className={classes.container} key={i} variant="subtitle2" >{n}</Typography>
        ))
      }
    </Grid>
  );

};

Notification.propTypes = {
  category: PropTypes.string,
};

export default Notification;