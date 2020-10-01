import React from "react";
import { useState } from "react";
import { postDay } from "../../services";
import Inputfield from "./Inputfield";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const ObservationSessionForm = () => {
  const [observatory, setObservatory] = useState("");
  const [day, setDay] = useState("");
  const [observers, setObservers] = useState("");
  const [comment, setComment] = useState("");


  const addHavainnointi = (event) => {
    event.preventDefault();
    // do things with form
    postDay({ day: day, observers: observers, comment: comment })
      .then(() => console.log("success"))
      .catch(() => console.error("Error in post request for havainnointiform"));
    setObservatory("");
    setDay("");
    setObservers("");
    setComment("");
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  return (
    <div>
      <form onSubmit={addHavainnointi}>
        <label>
          Lintuasema<br />
          <select>
            <option value="Hangon Lintuasema">Hangon Lintuasema</option>
            <option value="Jurmon Lintuasema">Jurmon Lintuasema</option>
          </select>
        </label>
        <Inputfield
          labelText="Päivämäärä"
          changeListener={(event) => setDay(event.target.value)}
          value={day}
        />
        <Inputfield
          labelText="Havainnoija(t)"
          changeListener={(event) => setObservers(event.target.value)}
          value={observers}
        />
        <Inputfield
          labelText="Kommentti"
          changeListener={(event) => setComment(event.target.value)}
          value={comment}
        />
        <p><button type="submit" onClick={handleClick}>Tallenna</button></p>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Lomake lähetetty!
        </Alert>
        </Snackbar>
      </form>

    </div>
  );
};
