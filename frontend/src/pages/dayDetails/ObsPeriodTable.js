import React from "react";
import { Table, TableHead, TableRow,
    TableBody, TableCell, withStyles, makeStyles
} from "@material-ui/core";
import { useTranslation } from "react-i18next";


const ObsPeriodTable = (props) => {

    const { t } = useTranslation();

    const useStyles = makeStyles({
        paper: {
          background: "white",
          padding: "20px 30px",
          margin: "0px 0px 50px 0px",
        },
      });

    const { obsPeriods } = props;
    const classes = useStyles();

    const StyledTableCell = withStyles(() => ({
        head: {
          backgroundColor: "grey",
          color: "white",
        },
        body: {
          fontSize: 14,
        },
      }))(TableCell);

      const formatTime = (time) => {
        const h = time.getHours();
        const m = time.getMinutes();
        return {h} + ":" + {m};
      };

return (
    <Table className={classes.table}>
        <TableHead>
            <TableRow>
                <StyledTableCell>{t("location")}</StyledTableCell>
                <StyledTableCell align="right">{t("startTime")}</StyledTableCell>
                <StyledTableCell align="right">{t("endTime")}</StyledTableCell>
                <StyledTableCell align="right">{t("type")}</StyledTableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {
                obsPeriods
                    .sort((a, b) => a.period - b.period)
                    .map((s, i) =>
                        <TableRow hover key={i}>
                            <StyledTableCell component="th" scope="row">
                                {s.location_id}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {s.startTime}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {s.endTime}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {s.observationType}
                            </StyledTableCell>
                        </TableRow>
                    )
            }
        </TableBody>
    </Table>
);
};

export default ObsPeriodTable;