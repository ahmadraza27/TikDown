export const ADD_TRUE= () => (dispatch: (arg0: { type: string; payload: null; }) => void) => {
    console.log("calling addtrue")
    dispatch({ type: "ADD_TRUE", payload: null });
};
export const ADD_FALSE = () => (dispatch: (arg0: { type: string; payload: null; }) => void) => {
    console.log("calling addFalse")
    dispatch({ type: "ADD_FALSE", payload: null });
};

export const ADD = () => (dispatch: (arg0: { type: string; payload: null; }) => void) => {
    console.log("calling addToggle popo")
    dispatch({ type: "ADD", payload: null });
  };
  
