import React, { useState } from "react";
import { TableCell, withStyles } from "@material-ui/core";
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

  const [local1, setLocal1] = useState(s.localOther);
  const [local2, setLocal2] = useState(s.localGåu);

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
        {local1+local2}
        {/*s.totalLocal*/}
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* {s.localOther} */}
        <LocalInput onChange={setLocal1} date={date} dataType="localOther" observatory={userObservatory} count={local1} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* {s.localGåu} */}
        <LocalInput onChange={setLocal2} date={date} dataType="localGau" observatory={userObservatory} count={local2} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right" name="migrantTotal" className="dotted">
        {s.allMigration}
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
        <LocalInput onChange={setLocal1} date={date} dataType="scatter" observatory={userObservatory} count={s.scatterObs} species={s.species} />
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