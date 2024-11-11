import React, { forwardRef } from "react";
import MuiAlert from "@mui/lab/Alert";

const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} variant="filled" {...props} ref={ref} />;
});

Alert.displayName = "Alert";

export default Alert;
