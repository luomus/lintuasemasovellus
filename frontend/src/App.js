import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Route,
  createRoutesFromElements,
  RouterProvider,
  createHashRouter
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomePage, UserManual, DayList, DayDetails, Logout, ClearObservatory } from "./pages";
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
import MainContainer from "./globalComponents/MainContainer";
import ProtectedRoute from "./globalComponents/ProtectedRoute";

const useStyles = makeStyles({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  }
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
  }

  let showNavBar = true;
  let appContext;

  if (!user.id) {
    showNavBar = false;
  } else if (station) {
    appContext = {
      user,
      observatory,
      station,
      stations,
      speciesData
    };
  }

  const router = createHashRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainContainer showNavBar={showNavBar} />}>
        <Route path="/logout" element={<Logout />}></Route>
        <Route path="/changeObservatory" element={<ClearObservatory />}></Route>
        <Route path="/listdays" element={<ProtectedRoute><DayList /></ProtectedRoute>}/>
        <Route className={classes.container} path="/daydetails/:day" element={<ProtectedRoute><DayDetails /></ProtectedRoute>}/>
        <Route path="/manual" element={<ProtectedRoute><UserManual /></ProtectedRoute>}/>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
      </Route>
    )
  );

  return (
    <CssBaseline>
      <AppContext.Provider value={appContext}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    </CssBaseline>
  );
};

export default App;
