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

  const [localOther, setLocalOther] = useState(parseInt(s.localOther));
  const [localGau, setLocalGau] = useState(parseInt(s.localGåu));
  const [scatterObs, setScatterObs] = useState(s.scatterObs);

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
        <LocalInput onChange={setLocalOther} date={date} dataType="localOther" observatory={userObservatory} count={localOther} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right">
        {/* {s.localGåu} */}
        <LocalInput onChange={setLocalGau} date={date} dataType="localGau" observatory={userObservatory} count={localGau} species={s.species} />
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
        <LocalInput onChange={setScatterObs} date={date} dataType="scatter" observatory={userObservatory} count={scatterObs} species={s.species} />
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