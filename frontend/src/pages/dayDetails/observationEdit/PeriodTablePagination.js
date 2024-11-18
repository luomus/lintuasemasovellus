import React from "react";
import PropTypes from "prop-types";
import {
  TablePagination, Table, TableRow, TableFooter
} from "@mui/material";
import { useTranslation } from "react-i18next";

const PeriodTablePagination = ({
  list, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
  page
}) => {

  const { t } = useTranslation();

  if (list.length < 50) {
    return null;
  }
  return (
    <Table>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[50, 100, { label: t("all"), value: list.length }]}
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
            slotProps={{
              select: {
                inputProps: { "aria-label": "rows per page" },
                native: true
              }
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
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
