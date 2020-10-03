

import { TableFooter, TablePagination, TableRow } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const DayPagination = ({ listSize }) => {
  if (listSize < 10) {
    return null;
  }
  /*
  *  Aseta asetukset paginaatiolle: https://material-ui.com/components/tables/
  */
  return (
    <TableFooter>
      <TableRow>
        <TablePagination

        />
      </TableRow>
    </TableFooter>
  );
};

DayPagination.propTypes = {
  listSize: PropTypes.number.isRequired,
};

export default DayPagination;
