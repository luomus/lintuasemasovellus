const initialState =
  [{ key: 1, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0, verkonPituus: 0, alku: "00:00", loppu: "00:00" }];

const catchRowsReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_ROW":
      return [
        ...state,
        {
          key: state.length > 0 ? state[state.length-1].key +1: 1, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0,
          verkonPituus: 0, alku: "00:00", loppu: "00:00"
        }
      ];
    case "ADD_ROW_WITH_KEY":
      return [{ key: action.data, pyydys: "", pyyntialue: "", verkkokoodit: "", lukumaara: 0, verkonPituus: 0, alku: "00:00", loppu: "00:00" }];
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


export const addOneCatchRow = (key = -1) => {
  if (key === -1){
    return {
      type: "ADD_ROW"
    };
  } else {
    return {
      type: "ADD_ROW_WITH_KEY",
      data: key
    };
  }
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
      data: []
    };
  } else {
    return {
      type: "SET_ROWS",
      data: rowData
    };
  }
};

export const setNewCatchRow = () => {
  return {
    type: "SET_ROWS",
    data: initialState
  };
};

export default catchRowsReducer;