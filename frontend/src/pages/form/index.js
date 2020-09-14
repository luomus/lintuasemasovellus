import React from "react";
import { useState } from "react";
import Inputfield from "./Inputfield";



export const Form = () => {
  const [finnishName, setFinnishName] = useState("");
  const [swedishName, setSwedishName] = useState("");
  const [latName, setLatName] = useState("");
  const [location, setLocation] = useState("");
  const [spotter, setSpotter] = useState("");
  const [time, setTime] = useState("");

  const addHavainto = (event) => {
    event.preventDefault();
    // do things with form
  };

  return (
    <div>
      <form onSubmit={addHavainto}>
        <Inputfield
          labelText="Suomenkielinen nimi"
          changeListener={(event) => setFinnishName(event.target.value)}
          value={finnishName}
        />
        <Inputfield
          labelText="Ruotsinkielinen nimi"
          changeListener={(event) => setSwedishName(event.target.value)}
          value={swedishName}
        />
        <Inputfield
          labelText="Tieteellinen nimi"
          changeListener={(event) => setLatName(event.target.value)}
          value={latName}
        />
        <Inputfield
          labelText="Sijainti"
          changeListener={(event) => setLocation(event.target.value)}
          value={location}
        />
        <Inputfield
          labelText="Havainnoijan nimi"
          changeListener={(event) => setSpotter(event.target.value)}
          value={spotter}
        />
        <Inputfield
          labelText="Aika"
          changeListener={(event) => setTime(event.target.value)}
          value={time}
        />
        <p><button type="submit">Tallenna</button></p>

      </form>

    </div>
  );
};
