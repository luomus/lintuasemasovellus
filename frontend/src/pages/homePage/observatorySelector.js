import React, { useState } from "react";
import {
    Dialog, DialogTitle, Button, FormControl, InputLabel,
    Typography, Select, MenuItem
} from "@material-ui/core/";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import store from "../../store";
import { setUserObservatory } from "../../reducers/userObservatoryReducer";



const ObservatorySelector = () => {


    const { t } = useTranslation();
    const [observatory, setObservatory] = useState("");
    const stations = useSelector(state => state.stations);
    const [open, setOpen] = React.useState(true);

    const userObservatory = useSelector(state => state.userObservatory);

    const handleClose = () => {
        setOpen(false);
    };

    const selectUserObservatory = (event) => {
        event.preventDefault();
        store.dispatch(setUserObservatory(observatory))
    };
    if (Object.keys(userObservatory).length === 0) {
        return (
            <Dialog disableBackdropClick={true} maxWidth="xs" fullWidth={true} onClose={handleClose} aria-labelledby="observatory-dialog" open={open}>
                <DialogTitle id="observatory-dialog">Valitse lintuasema</DialogTitle>

                <form onSubmit={selectUserObservatory}>
                    <FormControl>
                        <InputLabel id="Lintuasema">{t("observatory")} *</InputLabel>
                        <Select required
                            labelId="observatory"
                            id="select"
                            value={observatory}
                            onChange={(event) => setObservatory(event.target.value)}
                        >
                            {
                                stations.map((station, i) =>
                                    <MenuItem id={station.observatory.replace(/ /g, "")} value={station.observatory} key={i}>
                                        {station.observatory}
                                    </MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <br />
                    <br />
                    <Button variant="outlined" type="submit" id="submit" onClick={handleClose}>Tallenna</Button>
                    <br />

                </form>

            </Dialog>
        )
    }

    return (<div>
        <Typography>Valittu asema: {userObservatory}</Typography>
        <Button>Muokkaa (kesken)</Button>
    </div>
    )

};
export default ObservatorySelector