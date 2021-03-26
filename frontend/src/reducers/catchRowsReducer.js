const initialState =
  [{ key: 1, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0, verkonPituus: 0, alku: "00:00", loppu: "00:00" }];

const catchRowsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ROW":
      return [
        ...state,
        {
          key: state.length > 0 ? state[state.length-1].key +1: 1, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0,
          verkonPituus: 0, alku: "00:00", loppu: "00:00"
        }
      ];
    case "DELETE_ROW":
      return state.filter(row => row.key !== action.data.key);
    case "TOGGLE_ROW_DETAILS":
      return state.map(row =>
        row.key !== action.data.key
          ? row
          : {
            ...row,
            [action.data.changedDetail]: action.data.newValue
          }
      );
    case "SET_ROWS":
      return action.data;
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


export const setCatches = (rowData) => {
  if (rowData.length === 0 || !rowData) {
    return {
      type: "SET_ROWS",
      data: initialState
    };
  } else {
    return {
      type: "SET_ROWS",
      data: rowData
    };
  }
};

export default catchRowsReducer;