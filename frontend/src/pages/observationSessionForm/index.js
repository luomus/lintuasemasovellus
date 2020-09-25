import React from "react";
import { useState } from "react";
import { postHavainnointiform } from "../../services/havainnointilist";
import Inputfield from "./Inputfield";



export const ObservationSessionForm = () => {
  const [observatory, setObservatory] = useState("");
  const [date, setDate] = useState("");


  const addHavainnointi = async (event) => {
    event.preventDefault();
    // do things with form
    postHavainnointiform({ date: date })
      .then(() => console.log("success"))
      .catch(() => console.error("problem"));
    setObservatory("");
    setDate("");
  };

  return (
    <div>
      <form onSubmit={addHavainnointi}>
        <Inputfield
          labelText="Lintuasema"
          changeListener={(event) => setObservatory(event.target.value)}
          value={observatory}
        />
        <Inputfield
          labelText="Päivämäärä"
          changeListener={(event) => setDate(event.target.value)}
          value={date}
        />

        <p><button type="submit">Tallenna</button></p>

      </form>

    </div>
  );
};