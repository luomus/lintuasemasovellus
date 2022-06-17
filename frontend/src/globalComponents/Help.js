import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";

const Help = (props) => {
  return(
    <div>
      <Tooltip title={props.title}
        placement={props.placement}
        arrow
      >
        <IconButton disableRipple>
          <QuestionMarkRoundedIcon color="primary"/>
        </IconButton>
      </Tooltip>
    </div>
  );
};

Help.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.string
};

export default Help;