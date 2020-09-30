import React, { useEffect, useState } from "react";
import { getDays } from "../../services";


export const ObservationSessionList = () => {
  const [list, setList] = useState([]);


  useEffect(() => {
    getDays()
      .then(daysJson => setList(daysJson));
  }, []);

  console.log(list);

  if (!list) return null;

  /*
  * Muuta minut:
  * tällä hetkellä käyttää päiväroutea
  * ja tulostaa vain päivät.
  */
  return (
    <div>
      <h3>Days</h3>
      <ul>
        {
          list.map((entry, i) => {
            return <li key={i}>
              {entry.day}
              {entry.observers}
              {entry.comment}
            </li>;
          })
        }
      </ul>
    </div>
  );
};
