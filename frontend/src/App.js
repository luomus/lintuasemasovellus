import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomePage, UserManual, DayList, DayDetails, Login } from "./pages";
import NavBar from "./globalComponents/NavBar";
import Footer from "./globalComponents/Footer";
import { getPerson, getCurrentUser } from "./services";
import { setUser } from "./reducers/userReducer";
import { setUserObservatory } from "./reducers/userObservatoryReducer";
import { initializeStations } from "./reducers/obsStationReducer";
import { clean as DraftsClean } from "./services/draftService";
import { initializeSpecies } from "./reducers/speciesReducer";
import LoadingSpinner from "./globalComponents/LoadingSpinner";
import { makeStyles } from "@mui/styles";
import { createSelector } from "reselect";
import { AppContext } from "./AppContext";

const useStyles = makeStyles({
  mainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "50px",
    overflowY: "auto"
  },
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

});

const stationSelector = createSelector(
  [state => state.stations, state => state.userObservatory],
  (stations, userObservatory) => (
    stations?.find(s => s.observatory === userObservatory) || null
  )
);

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [userLoading, setUserLoading] = useState(true);
  const [contextDataLoading, setContextDataLoading] = useState(false);

  const user = useSelector(state => state.user);
  const observatory = useSelector(state => state.userObservatory);
  const station = useSelector(stationSelector);
  const stations = useSelector(state => state.stations);
  const speciesData = useSelector(state => state.speciesData);

  useEffect(() => {
    getPerson()
      .then(response => response.data)
      .then(response => {
        dispatch(setUser(response));
        getCurrentUser()
          .then(currentUser => {
            const observatory = currentUser.data[0].observatory;
            if (observatory) {
              dispatch(setUserObservatory(observatory));
            }

            setContextDataLoading(true);
            dispatch(initializeStations());
            dispatch(initializeSpecies());

            DraftsClean();

            setUserLoading(false);
          });
      })
      .catch(() => {
        setUserLoading(false);
      });
  }, []);

  useEffect(() => {
    if (stations && speciesData) {
      setContextDataLoading(false);
    }
  }, [stations, speciesData]);

  if (userLoading || contextDataLoading) {
    return (
      <LoadingSpinner/>
    );
  } else if (!user.id) {
    return (
      <CssBaseline>
        <div className={classes.mainContainer}>
          <Login />
          <Footer />
        </div>
      </CssBaseline>
    );
  } else {
    let mainContent;
    if (station) {
      const context = {
        user,
        observatory,
        station,
        stations,
        speciesData
      };

      mainContent = (
        <AppContext.Provider value={context}>
          <Routes>
            <Route path="/listdays" element={<DayList />}/>
            <Route className={classes.container} path="/daydetails/:day" element={<DayDetails />}/>
            <Route path="/manual" element={<UserManual />}/>
            <Route path="/" element={<HomePage />}/>
          </Routes>
        </AppContext.Provider>
      );
    }

    return (
      <CssBaseline>
        <div className={classes.mainContainer}>
          <NavBar user={user} observatory={observatory} stations={stations} />
          { mainContent }
          <Footer />
        </div>
      </CssBaseline>
    );
  }
};

export default App;
