import React from "react";
import PropTypes from "prop-types";
import {
  TablePagination, Table, TableRow, TableFooter
} from "@mui/material";
import { useTranslation } from "react-i18next";

const PeriodTablePagination = ({
  totalCount, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
  page
}) => {

  const { t } = useTranslation();

  if (totalCount < 50) {
    return null;
  }
  return (
    <Table>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[50, 100, { label: t("all"), value: -1 }]}
            colSpan={3}
            labelRowsPerPage={t("rowsPerPage")}
            labelDisplayedRows={
              ({ from, to, count }) => {
                return "" + from + " - " + to + t("to") + count;
              }
            }
            count={totalCount}
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
  totalCount: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired
};

export default PeriodTablePagination;
