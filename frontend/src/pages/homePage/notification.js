import React from "react";//
import {
  Typography
} from "@material-ui/core/";
import  { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  container: {
    padding: "5px",
    //background: "#f0ede6",
    borderRadius: 3,
    //boxShadow: "0 0px 0px 2px #f0ede6",
  }
}));

const Notification = ({ category }) => {
  const classes = useStyles();

  if ( category === "catches" ) {

    const allNotificationsByRow = useSelector(state => state.notifications);
    let notificationsSet = new Set();
    let errorsSet = new Set();

    Object.keys(allNotificationsByRow).map(i => {
      allNotificationsByRow[String(i)].notifications.forEach(n => notificationsSet.add(n));
      allNotificationsByRow[String(i)].errors.forEach(e => errorsSet.add(e));
    });


    const notifications = [... notificationsSet];
    const errors = [... errorsSet];

    console.log("notes and errors", notifications, errors);

    return (
      <div className={classes.container}>
        { errors.length > 0 &&
          errors.map((e, i) => (
            <Typography key={i} variant="subtitle2" color="secondary">{e}</Typography>
          ))
        }
        { notifications.length > 0 &&
          notifications.map((n, i) => (
            <Typography key={i} variant="subtitle2" >{n}</Typography>
          ))
        }
        <br />
      </div>
    );
  }
};


export default Notification;