import { withStyles } from "@mui/styles";
import { TableCell, TableRow } from "@mui/material";

export const StyledTableCell = withStyles(() => ({
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

export const StyledTableRow = withStyles(() => ({
  root: {
    "&:nth-child(even)": {
      background: "#70cfff3d",
      "&:hover": {
        background: "#67cafd80",
      },
    },
  },
}))(TableRow);
