const initialState = {
  day: null,
  observers: "",
  comment: "",
  type: "",
  location: "",
  shorthand: ""
};

const baseFormDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_BASE_FORM_DATA":
      return action.data;
    case "SET_BASE_FORM_DATA_ITEM":
      return { ...state, [action.data.key]: action.data.value };
    default:
      return state;
  }
};

export const setDay = (day) => {
  return {
    type: "SET_BASE_FORM_DATA_ITEM",
    data: {
      key: "day",
      value: day
    }
  };
};

export const setObservers = (observers) => {
  return {
    type: "SET_BASE_FORM_DATA_ITEM",
    data: {
      key: "observers",
      value: observers
    }
  };
};

export const setComment = (comment) => {
  return {
    type: "SET_BASE_FORM_DATA_ITEM",
    data: {
      key: "comment",
      value: comment
    }
  };
};


export const setType = (type) => {
  return {
    type: "SET_BASE_FORM_DATA_ITEM",
    data: {
      key: "type",
      value: type
    }
  };
};

export const setLocation = (location) => {
  return {
    type: "SET_BASE_FORM_DATA_ITEM",
    data: {
      key: "location",
      value: location
    }
  };
};

export const setShorthand = (shorthand) => {
  return {
    type: "SET_BASE_FORM_DATA_ITEM",
    data: {
      key: "shorthand",
      value: shorthand
    }
  };
};

export const setBaseFormData = (baseData) => {
  return {
    type: "SET_BASE_FORM_DATA",
    data: baseData
  };
};

export const setInitialBaseFormData = (initialData = {}) => {
  return {
    type: "SET_BASE_FORM_DATA",
    data: {
      ...initialState,
      ...initialData
    }
  };
};



export default baseFormDataReducer;
