import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ObsStation from "../../globalComponents/ObsStation";
import { getDays } from "../../services";


export const DayList = () => {
  const [list, setList] = useState([]);


  useEffect(() => {
    getDays()
      .then(daysJson => setList(daysJson));
  }, []);


  console.log(list);

  if (!list) return null;

  return (
    <div>
      <Typography variant="h5" component="h2" >
        Päivät
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Päivä</TableCell>
            <TableCell align="right">Havainnoijat</TableCell>
            <TableCell align="right">Kommentti</TableCell>
            <TableCell align="right">Havainnointiasema</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            list.map((s, i) =>
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {s.day}
                </TableCell>
                <TableCell align="right">
                  {s.observers}
                </TableCell>
                <TableCell align="right">
                  {s.comment}
                </TableCell>
                <TableCell align="right">
                  <ObsStation id={s.observatory} />
                </TableCell>

              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  );
};
