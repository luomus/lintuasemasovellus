import React, { useState } from "react"; //
import {
  TextField, InputLabel, Select, MenuItem, FormControl,
  FormControlLabel, InputAdornment, Grid, FormGroup,
  Dialog, DialogActions, DialogContentText, DialogContent, Button
} from "@material-ui/core/";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { toggleCatchDetails, deleteOneCatchRow } from "../../reducers/catchRowsReducer";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 100,
  },
  formControlLabel: {
    padding: "0px 30px 0px 0px",
    margin: theme.spacing(1),
  },
  formControlLabel2: {
    padding: "0px 30px 0px 0px",
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  netCodes: {
    width: 110,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 75,
  },
}
));

const catchTypes = ["Vakioverkko",
  "Lisäverkko",
  "Petoverkot",
  "Rastasverkko",
  "Katiska",
  "Lokkihäkki",];

const catchAreas = {
  "Vakioverkko": ["Vakioverkot K", "Vakioverkot muu"],
  "Lisäverkko": ["Piha", "Gåu", "Kärjen ruovikko", "Muu"],
  "Petoverkot": ["Vakiopetoverkot", "Muut petoverkot"],
  "Rastasverkko": ["Piha", "Gåu", "Muu"],
  "Katiska": ["Gåu", "Kallskär", "Muu"],
  "Lokkihäkki": ["Gåu", "Kallskär", "Muu"],
  "": [""]
};


const amountLimits ={
  "Vakioverkko": 11,
  "Lisäverkko": 9,
  "Petoverkot": 8,
};


const catchesWithoutLength = ["Katiska", "Lokkihäkki"];

const preSetLengths = {
  "Vakioverkot muu": 9,
  "Vakioverkot K": 12,
  "Piha": 9,
  "Vakiopetoverkot":12
};

//const maxNumbers = {
//  "Vakioverkko": 11,
//  "Lisäverkko": 9,
//  "Petoverkot": 12,
//  "Rastasverkko": 9,
//  "Katiska": 12,
//  "Lokkihäkki": 12,
//  "": ""
//};



const CatchType = ({ cr }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setshowModal] = useState(false);

  const handleChange = (target) => {
    if (target.name==="lukumaara") {
      if (cr.pyydys in amountLimits && target.value > amountLimits[String(cr.pyydys)]) {
        setModalMessage(t("Please recheck that you mean to declare that many catches"));
        setshowModal(true);
      }
    } else if (target.name==="pyyntialue" && cr.pyydys !== "Rastasverkko") {
      //autofill length for nets that are always the same length
      if (target.value in preSetLengths) {
        dispatch(toggleCatchDetails(cr.key, "verkonPituus", preSetLengths[String(target.value)]));
      }
    } else if(target.name==="pyydys" && cr.verkonPituus!==0) {
      //remove previous length autofill, when catch changes
      dispatch(toggleCatchDetails(cr.key, "verkonPituus", 0));
    }
    // seuraava ongelmallinen, koska modaali triggeröityy, jo kun kirjoittaa '1' luvusta '11'
    // } else if (target.name==="verkonPituus"){
    //   if ( target.value < 9 || target.value > 12 ) {
    //     setModalMessage(t("Net length is usually between 9 and 12 meters. Please check that your value is right."));
    //     setshowModal(true);
    //   }
    //}


    dispatch(toggleCatchDetails(cr.key, target.name, target.value));
  };

  const handleModalClose = () => {
    setshowModal(false);
  };

  const handleRowRemove = () => {
    dispatch(deleteOneCatchRow(cr));
  };


  return (
    <Grid item xs={12}>
      <FormGroup row className={classes.formGroup}>
        <FormControlLabel className={classes.formControlLabel}
          control={<FormControl className={classes.formControl}>
            <InputLabel id="Pyydys">{t("catchType")}</InputLabel>
            <Select
              required
              labelId="catchType"
              id="selectCatchType"
              name="pyydys"
              value={cr.pyydys}
              onChange={(event) => handleChange(event.target)}
            >
              {
                catchTypes.map((catchType, i) =>
                  <MenuItem id={catchType} value={catchType} key={i}>
                    {catchType}
                  </MenuItem>
                )
              }</Select>
          </FormControl>
          } />
        <FormControlLabel className={classes.formControlLabel}
          control={<FormControl className={classes.formControl}>
            <InputLabel id="Pyyntialue">{t("catchArea")}</InputLabel>
            <Select
              required
              labelId="catchArea"
              id="selectCatchArea"
              name="pyyntialue"
              value={cr.pyyntialue}
              onChange={(event) => handleChange(event.target)}
            >
              {
                catchAreas[String(cr.pyydys)].map((cArea, i) =>
                  <MenuItem id={cArea} value={cArea} key={i}>
                    {cArea}
                  </MenuItem>
                )
              }</Select>
          </FormControl>} />

        <FormControlLabel className={classes.formControlLabel2}
          label={t("netopened")} labelPlacement="start"
          control={<TextField
            id="opened"
            type="time"
            defaultValue={cr.alku}
            name="alku"
            style={{ paddingLeft: "5px" }}
            onChange={(event) => handleChange(event.target)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 60,
            }}
          />} />

        <FormControlLabel className={classes.formControlLabel2}
          label={t("netclosed")} labelPlacement="start"
          control={<TextField
            id="closed"
            type="time"
            name="loppu"
            defaultValue={cr.loppu}
            style={{ paddingLeft: "5px" }}
            onChange={(event) => handleChange(event.target)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 60,
            }}
          />} />

        <FormControl className={classes.formControlLabel}>
          <TextField
            className={classes.netCodes}
            id="netCodes"
            name="verkkokoodit"
            label={t("netCodes")}
            onChange={(event) => handleChange(event.target)}
            value={cr.verkkokoodit}
          />
        </FormControl>
        <FormControlLabel className={classes.formControlLabel2}
          label={t("catchCount")} labelPlacement="start"
          control={
            <TextField
              className={classes.textField}
              id="selectCatchCount"
              name="lukumaara"
              required
              type="number"
              value={cr.lukumaara}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{t("pcs")}</InputAdornment>, inputProps: { min: 0 } }}
            />
          } />

        { (cr.pyydys.length === 0 || (cr.pyydys.length > 1  && catchesWithoutLength.indexOf(cr.pyydys) > -1 )) //is a catch without length
          ? <div></div>
          :
          <FormControlLabel className={classes.formControlLabel2}
            label={t("netLength")} labelPlacement="start"
            control={<TextField
              className={classes.textField}
              id="selectNetLength"
              required
              name="verkonPituus"
              type="number"
              value={cr.verkonPituus}
              onChange={(event) => handleChange(event.target)}
              InputProps={{ endAdornment: <InputAdornment position="end">{"m"}</InputAdornment>, inputProps: { min: 0 } }}
            />
            } />
        }
        <Button id="removeButton" size="small" onClick={() => handleRowRemove()}  >
            &#10060;
        </Button>
      </FormGroup>
      <Dialog open={showModal} onClose={handleModalClose}  disableBackdropClick={true}>
        <DialogContent>
          <DialogContentText id="confirmation dialog">
            {modalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>

  );
};

CatchType.propTypes = {
  cr: PropTypes.object.isRequired,
};

export default CatchType;