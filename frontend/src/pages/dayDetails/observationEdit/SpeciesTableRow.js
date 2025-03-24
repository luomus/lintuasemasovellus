import React, { memo, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import LocalInput from "./LocalInput";
import { StyledTableCell } from "../../../globalComponents/common";


const SpeciesTableRow = ({ day, s, onChange }) => {
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

  const onLocalInputChange = (name, data) => {
    onChange({ ...s, [name]: data.totalCount, [name + "Shorthand"]: data.shorthand });
  };

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
        {s.localOther + s.localGåu}
      </StyledTableCell>
      <StyledTableCell align="right">
        <LocalInput inputRef={input1Ref} onChange={(data) => onLocalInputChange("localOther", data)} dataType="localOther" day={day} shorthand={s.localOtherShorthand} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right">
        <LocalInput inputRef={input2Ref} onChange={(data) => onLocalInputChange("localGåu", data)} dataType="localGau" day={day} shorthand={s.localGåuShorthand} species={s.species} />
      </StyledTableCell>
      <StyledTableCell align="right" name="migrantTotal" className="dotted">
        {s.constMigration + s.nightMigration + s.otherMigration + s.scatter}
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
        <LocalInput inputRef={input3Ref} onChange={(data) => onLocalInputChange("scatter", data)} dataType="scatter" day={day} shorthand={s.scatterShorthand} species={s.species} />
      </StyledTableCell>
    </>
  );
};

SpeciesTableRow.propTypes = {
  day: PropTypes.string.isRequired,
  s: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default memo(SpeciesTableRow);
