import React, { useState, useEffect } from "react";

const esim = [
  {
    suomeksi: "jokunimi",
    ruotsiksi: "ruotsinimi",
    tieteellinen: "tieteellinennimi",
    sijainti: "paikka",
    havainnoija: "henkilö",
    aika: "aika"
  }
];

export const HavaintoList = () => {
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
              {entry.suomeksi}
            </div>
          </div>
        );
      })}
    </div>
  );
};