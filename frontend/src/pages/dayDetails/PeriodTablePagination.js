import React from "react";
import PropTypes from "prop-types";
import {
  TablePagination, TableFooter, TableRow
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

const PeriodTablePagination = ({
  list, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
  page
}) => {

  const { t } = useTranslation();

  if (list.length < 10) {
    return null;
  }
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 25, { label: t("all"), value: -1 }]}
          colSpan={3}
          labelRowsPerPage={t("rowsPerPage")}
          labelDisplayedRows={
            ({ from, to, count }) => {
              return "" + from + " - " + to + t("to") + count;
            }
          }
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

PeriodTablePagination.propTypes = {
  list: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired
};

export default PeriodTablePagination;
