import React from "react";
import PropTypes from "prop-types";
import {
  TablePagination, TableFooter, TableRow
} from "@mui/material";
import { useTranslation } from "react-i18next";

const DayPagination = ({
  totalCount, rowsPerPage, handleChangePage, handleChangeRowsPerPage,
  page
}) => {

  const { t } = useTranslation();

  if (totalCount < 10) {
    return null;
  }
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 25, { label: t("all"), value: -1 }]}
          colSpan={4}
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
  );
};

DayPagination.propTypes = {
  totalCount: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired
};

export default DayPagination;
