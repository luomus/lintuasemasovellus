import React from "react";//
import {
  Typography
} from "@material-ui/core/";
import PropTypes from "prop-types";


// { notifications:["1", "2"], errors:["a", "b"] };
const Notification = ({ notifications }) => {

  //const notifications = useSelector(state => state.notifications);
  console.log("notif in NotifiCation", notifications);



  return (
    <div>
      { notifications.errors.length > 0 &&
        notifications.errors.map((e, i) => (
          <Typography key={i} variant="subtitle2" color="secondary">{e}</Typography>
        ))
      }

      { notifications.notifications.length > 0 &&
        notifications.notifications.map((n, i) => (
          <Typography key={i} variant="subtitle2" >{n}</Typography>
        ))
      }
    </div>
  );
};

Notification.propTypes ={
  notifications: PropTypes.object.isRequired
};

export default Notification;