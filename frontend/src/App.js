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
import { makeStyles } from "@mui/styles";
import { clean as DraftsClean } from "./services/draftService";
import { initializeSpecies } from "./reducers/speciesReducer";

const App = () => {

  const useStyles = makeStyles({
    flexi: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      height: "95vh",
      width:"98vw",
    },
    spinner: {
      padding: "0px",
      margin: "60px 60px",
      fontSize: "10px",
      position: "relative",
      borderTop: "1.1em solid lightgrey",
      borderRight: "1.1em solid lightgrey",
      borderBottom: "1.1em solid lightgrey",
      borderLeft: "1.1em solid #2691d9",
      animation: "$spin 1.1s infinite linear",
      "&, :after": {
        borderRadius: "50%",
        width: "10em",
        height: "10em",
      },
    },
    "@keyframes spin": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  });

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
      <div className={classes.flexi}>
        <div className={classes.spinner}>
        </div>
      </div>
    );
  } else if (!user.id) {
    return (
      <CssBaseline>
        <div>
          <Login />
          <Footer />
        </div>
      </CssBaseline>
    );
  } else if (userObservatory !== "") {
    return (
      <CssBaseline>
        <div>
          <NavBar user={user} />
          <Routes>
            <Route path="/listdays" element={<DayList userObservatory={userObservatory} />} />
            <Route path="/daydetails/:day" element={<DayDetails userObservatory={userObservatory} />} />
            <Route path="/manual" element={<UserManual />} />
            <Route path="/" element={<HomePage user={user} userObservatory={userObservatory} />} />
          </Routes>
          <Footer />
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
