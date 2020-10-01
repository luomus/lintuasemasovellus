import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { getStation } from "../../mappings/observationMap";
import { getDays } from "../../services";


export const ObservationSessionList = () => {
  const [list, setList] = useState([]);


  useEffect(() => {
    getDays()
      .then(daysJson => setList(daysJson));
  }, []);

  console.log(list);

  if (!list) return null;

  /*
  * Muuta minut:
  * tällä hetkellä käyttää päiväroutea
  * ja tulostaa vain päivät.
  */
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
            list.map((elemtn, i) =>
              <TableRow key={i}>
                <TableCell component="th" scope="row">
                  {elemtn.day}
                </TableCell>
                <TableCell align="right">
                  {elemtn.observers}
                </TableCell>
                <TableCell align="right">
                  {elemtn.comment}
                </TableCell>
                <TableCell align="right">
                  {getStation(elemtn.observatory)}
                </TableCell>

              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  );
};
