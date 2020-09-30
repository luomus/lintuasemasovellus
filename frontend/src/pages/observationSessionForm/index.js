import React from "react";
import { useState } from "react";
import { postDay } from "../../services";
import Inputfield from "./Inputfield";



export const ObservationSessionForm = () => {
  const [observatory, setObservatory] = useState("");
  const [day, setDay] = useState("");

  /*
  * Muuta minut:
  * Tällä hetkellä lukee vain day-kentän tiedot ja lähettää ne
  * backendin routeen /api/addDay
  */

  const addHavainnointi = (event) => {
    event.preventDefault();
    // do things with form
    postDay({ day: day })
      .then(() => console.log("success"))
      .catch(() => console.error("Error in post request for havainnointiform"));
    setObservatory("");
    setDay("");
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

        <p><button type="submit">Tallenna</button></p>

      </form>

    </div>
  );
};