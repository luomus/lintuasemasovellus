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

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [userLoading, setUserLoading] = useState(true);
  const [initialDataLoading, setInitialDataLoading] = useState(false);

  const user = useSelector(state => state.user);
  const userObservatory = useSelector(state => state.userObservatory);
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

            setInitialDataLoading(true);
            dispatch(initializeStations());
            dispatch(initializeSpecies());

            DraftsClean();

            setUserLoading(false);
          });
      })
      .catch(() => {
        setUserLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (stations && speciesData) {
      setInitialDataLoading(false);
    }
  }, [stations, speciesData]);

  if (userLoading || initialDataLoading) {
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
  } else if (userObservatory !== "") {
    return (
      <CssBaseline>
        <div className={classes.mainContainer}>
          <NavBar user={user}/>
          <Routes>
            <Route path="/listdays" element={<DayList userObservatory={userObservatory}/>}/>
            <Route className={classes.container} path="/daydetails/:day" element={<DayDetails userObservatory={userObservatory}/>}/>
            <Route path="/manual" element={<UserManual/>}/>
            <Route path="/" element={<HomePage user={user} userObservatory={userObservatory}/>}/>
          </Routes>
          <Footer/>
        </div>
      </CssBaseline>
    );
  } else {
    return (
      <CssBaseline>
        <div>
          <NavBar user={user} />
          <Footer />
        </div>
      </CssBaseline>
    );
  }

};

export default App;
