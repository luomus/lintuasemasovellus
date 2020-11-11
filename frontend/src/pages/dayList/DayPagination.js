

import React from "react";
import PropTypes from "prop-types";
import {
  TablePagination, TableFooter, TableRow
} from "@material-ui/core";

const DayPagination = ({
  list, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
  page
}) => {


  if (list.length < 10) {
    return null;
  }
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true,
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableRow>
    </TableFooter>
  );
};

DayPagination.propTypes = {
  list: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired
};

export default DayPagination;
