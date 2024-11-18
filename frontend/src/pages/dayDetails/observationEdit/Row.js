import React, { useState, useLayoutEffect } from "react";
import { TableCell } from "@mui/material";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import LocalInput from "./LocalInput";


const Row = ({ s, date, userObservatory }) => {

  const StyledTableCell = withStyles(() => ({
    head: {
      backgroundColor: "grey",
      color: "white",
    },
    body: {
      fontSize: 14,
      "&:nth-child(1) summary": {
        cursor: "pointer",
      },
      "&.dotted": {
        borderLeft: "1px dotted",
      }
    },
  }))(TableCell);

  const [localOther, setLocalOther] = useState(parseInt(s.localOther));
  const [localGau, setLocalGau] = useState(parseInt(s.localGåu));
  const [scatterObs, setScatterObs] = useState(s.scatterObs);

  const input1Ref = React.createRef();
  const input2Ref = React.createRef();
  const input3Ref = React.createRef();

  useLayoutEffect(() => {
    const handleKeyDownEvent = e => {
      if(!["Enter", "Tab"].includes(e.key)) return;
      let elements = document.querySelectorAll("#standard-basic");
      let index = Array.from(elements).findIndex(a => a === e.target);
      if (index === -1) return;
      e.preventDefault();
      let amount = e.key === "Enter" ? 3 : 1; // Change to number of elements that are editable per row
      let nextIndex = e.shiftKey ? index - amount : index + amount;
      elements.item(nextIndex)?.focus();
      elements.item(nextIndex)?.select();
    };

    [input1Ref, input2Ref, input3Ref].map((i) => {
      i?.current?.addEventListener("keydown", handleKeyDownEvent);
    });

    return () => {
      [input1Ref, input2Ref, input3Ref].map((i) => {
        i?.current?.removeEventListener("keydown", handleKeyDownEvent);
      });
    };
  }, [input1Ref, input2Ref, input3Ref]);

  return (
    <>
      <StyledTableCell component="th" scope="row">
        {s.notes ?
          <details>
            <summary tabIndex={999}>{s.species}</summary>
            <p> {s.notes} </p>
          </details>
          : <>{s.species}</>}
      </StyledTableCell>
      <StyledTableCell name="localTotal" align="right">
        {localOther + localGau}
        {/*s.totalLocal*/}
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* {s.localOther} */}
        <LocalInput inputRef={input1Ref} onChange={setLocalOther} date={date} dataType="localOther" observatory={userObservatory} count={localOther} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* {s.localGåu} */}
        <LocalInput inputRef={input2Ref} onChange={setLocalGau} date={date} dataType="localGau" observatory={userObservatory} count={localGau} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right" name="migrantTotal" className="dotted">
        {s.constMigration + s.nightMigration + s.otherMigration + scatterObs}
      </StyledTableCell>
      <StyledTableCell align="right">
        {s.constMigration}
      </StyledTableCell>
      <StyledTableCell align="right">
        {s.otherMigration}
      </StyledTableCell>
      <StyledTableCell align="right">
        {s.nightMigration}
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* s.scatterObs */}
        <LocalInput inputRef={input3Ref} onChange={setScatterObs} date={date} dataType="scatter" observatory={userObservatory} count={scatterObs} species={s.species} />
      </StyledTableCell>
    </>
  );
};

export default Row;

Row.propTypes = {
  s: PropTypes.any,
  date: PropTypes.string,
  userObservatory: PropTypes.string
};
