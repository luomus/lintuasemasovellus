import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const esim = [
  {
    lintuasema: "hangon lintuasema",
    päivämäärä: "11.08.2020",

  }
];

export const ObservationSessionList = () => {
  const [list, setList] = useState([]);

  console.log(list);

  useEffect(() => {
    setList(esim);
  }, []);

  console.log(list);
  if (!list) return null;
  return (
    <div>
      {list.map((entry, i) => {
        return (
          <div key={i}>
            <div>
              {entry.lintuasema}
            </div>
            <div>
              {entry.päivämäärä}
            </div>
          </div>
        );
      })}
    </div>
  );
};