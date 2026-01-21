// addReducer.tsx
import * as FileSystem from 'expo-file-system/legacy'; // use legacy API to avoid deprecation

const tikDir = FileSystem.documentDirectory + 'tikDown/';

interface State {
  add: boolean;
  docsList: string[];
}

const initialState: State = {
  add: false,
  docsList: [], // start empty, we will fetch asynchronously
};

const CreateModalReducer = (state = initialState, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case "ADD_TRUE":
      return { ...state, add: true };
    case "ADD_FALSE":
      return { ...state, add: false };
    case "ADD":
      return { ...state, docsList: action.payload || [] }; // update docsList with fetched files
    default:
      return state;
  }
};

export default CreateModalReducer;

// Async action to fetch files
export const ADD = () => async (dispatch: any) => {
  try {
    const dir = await FileSystem.readDirectoryAsync(tikDir);
    const files = dir.map(f => tikDir + f); // full file paths
    dispatch({ type: "ADD", payload: files });
  } catch (error) {
    console.error("Error reading directory:", error);
    dispatch({ type: "ADD", payload: [] });
  }
};

export const ADD_TRUE = () => (dispatch: any) => {
  dispatch({ type: "ADD_TRUE" });
};

export const ADD_FALSE = () => (dispatch: any) => {
  dispatch({ type: "ADD_FALSE" });
};








// // for file handling
// import * as FileSystem from 'expo-file-system';
// let dlist: string[] = [];
// const tikDir = FileSystem.documentDirectory + 'tikDown/';

// const _getAllFilesInDirectory = async () => {
//     dlist =[];
//     let dir = await FileSystem.readDirectoryAsync(tikDir);

//     dir.forEach((val,i,ii) => {
//         // console.log("add reducer reducer ",val)
//         dlist.push(tikDir + val + "\n");
//     })
//     // console.log(dlist)
//     return dlist;

// }
// const initialState = {
//     add: false,
//     docsList:  _getAllFilesInDirectory(),
// }



// const CreateModalReducer = (state = initialState, action: { type: string }) => {
//     switch (action.type) {
//         case "ADD_TRUE":
//             // console.log("taggled add", state.add)
//             return {
//                 ...state,
//                 add: true
//             }
//         case "ADD_FALSE":
//             // console.log("taggled add", state.add)
//             return {
//                 ...state,
//                 add: false
//             }
//         case "ADD":
//             // console.log("taggled popp", state.docsList)
//             // _getAllFilesInDirectory()
//             // if (_getAllFilesInDirectory() != state.docsList){  
//             return {
//                 ...state,
//                 docsList: _getAllFilesInDirectory()

//             }

//         default:
//             return {
//                 ...state,
//             }

//     }
// }

// export default CreateModalReducer