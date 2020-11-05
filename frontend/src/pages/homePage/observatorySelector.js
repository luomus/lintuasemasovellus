import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel,
  Typography, Select, MenuItem, makeStyles
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import store from "../../store";
import { setUserObservatory } from "../../reducers/userObservatoryReducer";



const ObservatorySelector = () => {

  const useStyles = makeStyles((theme) => ({
    container: {
      minWidth: 200,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    submit: {

      minWidth: 120,
    },
  }));

  const { t } = useTranslation();
  const [observatory, setObservatory] = useState("");
  const stations = useSelector(state => state.stations);
  const [open, setOpen] = React.useState(true);

  const classes = useStyles();

  const userObservatory = useSelector(state => state.userObservatory);

  const observatoryIsSelected = Boolean(observatory);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    store.dispatch(setUserObservatory({}));
    setOpen(true);
  };

  const selectUserObservatory = (event) => {
    event.preventDefault();
    store.dispatch(setUserObservatory(observatory));
  };
  if (Object.keys(userObservatory).length === 0) {

    return (
      <Dialog id="observatory-dialog" disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Valitse lintuasema</DialogTitle>
        <DialogContent>

          <form id="observatorySelect" onSubmit={selectUserObservatory} className={classes.container}>
            <FormControl required className={classes.formControl}>
              <InputLabel id="Lintuasema">{t("observatory")}</InputLabel>
              <Select
                autoWidth={true}
                labelId="observatory"
                id="select-observatory"
                value={observatory}
                onChange={(event) => setObservatory(event.target.value)}
              >
                {
                  stations.map((station, i) =>
                    <MenuItem id={station.observatory.replace(/ /g, "")} value={station.observatory} key={i}>
                      {station.observatory.replace("_", " ")}
                    </MenuItem>
                  )
                }
              </Select>
            </FormControl>


          </form>
        </DialogContent>
        <DialogActions>
          <Button id="submit" disabled={!observatoryIsSelected} form="observatorySelect" onClick={handleClose} color="primary" type="submit">
            Tallenna
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (<div>
    <Typography>Valittu asema: {userObservatory.replace("_", " ")}</Typography>
    <Button id="observatorySelector" className={classes.submit} onClick={handleOpen}>Muokkaa</Button>
  </div>
  );

};
export default ObservatorySelector;