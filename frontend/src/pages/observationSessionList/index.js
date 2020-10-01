import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeStations } from "../../reducers/obsStationReducer";
import { getDays } from "../../services";


export const ObservationSessionList = () => {
  const [list, setList] = useState([]);

  const stations = useSelector(state => state.stations);

  const dispatch = useDispatch();

  const stationsAreSet = Boolean(stations.length);//check for length 0

  useEffect(() => {
    getDays()
      .then(daysJson => setList(daysJson));
  }, []);

  useEffect(() => {
    if(stationsAreSet) return;
    dispatch(initializeStations());
  }, [stationsAreSet, dispatch]);

  console.log(list);

  if (!list || !stationsAreSet) return null;

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
                  {stations
                    .find(station => station.id === elemtn.observatory)
                    .name
                  }
                </TableCell>

              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  );
};
