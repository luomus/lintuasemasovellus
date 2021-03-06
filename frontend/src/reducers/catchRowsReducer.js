const initialState =
  [{ key: 1, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0, verkonPituus: 0, alku: "00:00", loppu: "00:00" }];

const catchRowsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ROW":
      console.log("add");
      return [
        ...state,
        {
          key: state.length +1, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0,
          verkonPituus: 0, alku: "00:00", loppu: "00:00"
        }
      ];
    case "DELETE_ROW":
      console.log("delete");
      return state.filter(row => row.key !== action.data.key);
    case "TOGGLE_ROW_DETAILS":
      console.log("You fools! This is not even my final form!");
      console.log(state);
      return state.map(row =>
        row.key !== action.data.key
          ? row
          : {
            ...row,
            [action.data.changedDetail]: action.data.newValue
          }
      );
    default:
      return state;
  }
};


export const addOneCatchRow = () => {
  return {
    type: "ADD_ROW"
  };
};

export const deleteOneCatchRow = (lastRow) => {
  return {
    type: "DELETE_ROW",
    data: lastRow
  };
};

export const toggleCatchDetails = (key, changedDetail, newValue) => {
  return {
    type: "TOGGLE_ROW_DETAILS",
    data: {
      key: key,
      changedDetail:changedDetail,
      newValue: newValue
    }
  };
};

export default catchRowsReducer;