const initialState =
  [{ key: 1, pyydys: null, pyyntialue: null, verkkokoodit: "", lukumaara: 0, verkonPituus: 0, alku: "0.00", loppu: "0.00" }];

const catchRowsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ROW":
      console.log("add");
      return [
        ...state,
        {
          key: action.data, pyydys: null, pyyntialue: null, verkkokoodit: "", lukumaara: 0,
          verkonPituus: 0, alku: "0.00", loppu: "0.00"
        }
      ];
    case "DELETE_ROW":
      console.log("delete");
      //var newState = Object.keys(state).filter(key => (key !== action.data));
      return [state.filter(row => row.key !== action.data)];
    default:
      return state;
  }
};


export const addOneCatchRow = () => {
  //var newCatchRows = this.state;
  console.log("hello world");
  const id = Math.floor(Math.random() * 1000000) + 2;
  return {
    type: "ADD_ROW",
    data: id
  };
};

export const deleteOneCatchRow = (lastRow) => {
  console.log("last row:", lastRow);
  return {
    type: "DELETE_ROW",
    data: lastRow
  };
};

export default catchRowsReducer;