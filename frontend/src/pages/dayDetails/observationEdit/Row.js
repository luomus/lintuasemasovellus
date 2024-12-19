import React, { useState, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import LocalInput from "./LocalInput";
import { StyledTableCell } from "../../../globalComponents/common";


const Row = ({ s, date }) => {
  const [localOther, setLocalOther] = useState(0);
  const [localGau, setLocalGau] = useState(0);
  const [scatterObs, setScatterObs] = useState(0);

  const input1Ref = React.createRef();
  const input2Ref = React.createRef();
  const input3Ref = React.createRef();

  useEffect(() => {
    setLocalOther(s.localOther);
    setLocalGau(s.localGåu);
    setScatterObs(s.scatterObs);
  }, [s]);

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
        <LocalInput inputRef={input1Ref} onChange={setLocalOther} date={date} dataType="localOther" count={localOther} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* {s.localGåu} */}
        <LocalInput inputRef={input2Ref} onChange={setLocalGau} date={date} dataType="localGau" count={localGau} species={s.species} />
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
        <LocalInput inputRef={input3Ref} onChange={setScatterObs} date={date} dataType="scatter" count={scatterObs} species={s.species} />
      </StyledTableCell>
    </>
  );
};

export default Row;

Row.propTypes = {
  s: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired
};