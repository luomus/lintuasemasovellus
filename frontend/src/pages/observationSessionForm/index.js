import React from "react";
import { useState } from "react";
import Inputfield from "./Inputfield";



export const ObservationSessionForm = () => {
  const [observatory, setObservatory] = useState("");
  const [date, setDate] = useState("");


  const addHavainnointi = (event) => {
    event.preventDefault();
    // do things with form
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