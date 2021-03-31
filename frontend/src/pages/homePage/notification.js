import React from "react";//
import {
  Typography
} from "@material-ui/core/";
import  { useSelector } from "react-redux";
//import { validateCatchRows } from "./catchType";


const Notification = ({ category }) => {

  if ( category === "catches" ) {
    console.log("notes in note");

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
      <div>
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
      </div>
    );
  }
};


export default Notification;