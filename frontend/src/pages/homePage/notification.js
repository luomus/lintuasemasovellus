import React from "react";//
import {
  Typography, Grid
} from "@material-ui/core/";
import PropTypes from "prop-types";
import  { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    padding: "5px",
    borderRadius: 3,
  }
}));

const Notification = ({ category="all" }) => {
  const classes = useStyles();

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