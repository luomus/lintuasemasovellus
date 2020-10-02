import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeStations } from "../reducers/obsStationReducer";
import PropTypes from "prop-types";


const ObsStation = ({ id }) => {
  const stations = useSelector(state => state.stations);

  const stationsIsSet = Boolean(stations.length);//check for length is 0

  const dispatch = useDispatch();

  useEffect(() => {
    if (stationsIsSet) return;
    dispatch(initializeStations());
  }, [stationsIsSet, dispatch]);

  if (!stationsIsSet) return null;

  return (
    <>
      {stations.find(s => s.id === id).name}
    </>
  );
};

ObsStation.propTypes = {
  id: PropTypes.number.isRequired
};


export default ObsStation;
