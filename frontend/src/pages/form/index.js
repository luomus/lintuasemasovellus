import React from "react";
import { useInputField } from "../../hooks/inputField";
import Inputfield from "./Inputfield";



export const Form = () => {

  const finnishName = useInputField();
  const swedishName = useInputField();
  const latName = useInputField();
  const location = useInputField();
  const spotter = useInputField();
  const time = useInputField();

  const addHavainto = (event) => {
    event.preventDefault();
    // do things with form
  };

  return (
    <div>
      <form onSubmit={addHavainto}>
        <Inputfield
          labelText="Suomenkielinen nimi"
          {...finnishName}
        />
        <Inputfield
          labelText="Ruotsinkielinen nimi"
          {...swedishName}
        />
        <Inputfield
          labelText="Tieteellinen nimi"
          {...latName}
        />
        <Inputfield
          labelText="Sijainti"
          {...location}
        />
        <Inputfield
          labelText="Havainnoijan nimi"
          {...spotter}
        />
        <Inputfield
          labelText="Aika"
          {...time}
        />
        <p><button type="submit">Tallenna</button></p>

      </form>

    </div>
  );
};
