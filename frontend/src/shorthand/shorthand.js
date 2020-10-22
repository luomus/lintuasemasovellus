
let periods = [];



let startTime = "";
let endTime = "";
let species = "";


const reset = () => {
  startTime = "";
  endTime = "";
  species = "";

};

/*let kelloasiat = "";
let lisatieto = "";
let ika = "";
let ohituspuoli = "";
let ilmansuunta = "";

const group = (char) => {
  switch(char) {
    case " ":case "\n":
      break;
    case "0":case "1":case "2":
    case "3":case "4":case "5":
    case "6":case "7":case "8":
    case "9":
      if (kello()) {
        kelloasiat+=char;
      } else {
        yksilomaara+=char;
      }
      break;
    case ".":
      break;
    case "(":
      lisatieto(true);
      lisatieto += char;
      break;
    case ")":
      lisatieto(false);
      lisatieto += char;
      break;
    case ",":
      // lisää havainto
      break;
    case "‘":case "“":case "’":
      break;
    case "j":case "u":
    case "v":case "s":
    case "b":case "a":
    case "d":case "n":
    case "e":case "w":
      if(ilmansuunta())
        ilmansuunta+=char;
      else ika+=char;
      break;
    case "+":case "-":
      ohituspuoli+=char;
      break;
    case "/":
      break;
  }
};*/

const timeRegex = new RegExp(/^(([01][0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/);

export const parse = (text) => {

  const lines = text.split("\n");
  for (const line of lines) {
    if (line.match(timeRegex)) {
      if (!startTime) {
        startTime = line;
      } else {
        endTime = line;
        periods.push({
          startTime,
          endTime,
          species,
        });
        reset();
      }
    } else {
      let i = 0;
      for (; i < line.length; i++) {
        if (line.charAt(i) === " ") break;
        species += line.charAt(i);
      }
      const restOfLine = line.substring(i+1);
      const observationsList = restOfLine.split(",");
      for (const observation of observationsList) {
        if (observation.includes("/")) {
          const splitObs = observation.split("/");
          switch (splitObs.length) {
            case 0:
            case 1:
            case 2:
          }
        } else {
          // asdf
        }
      }
    }
  }

};

