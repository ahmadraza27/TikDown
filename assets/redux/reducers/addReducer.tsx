// addReducer.tsx
import * as FileSystem from 'expo-file-system/legacy';

const tikDir = FileSystem.documentDirectory + 'tikDown/';

const initialState = {
    add: false,
    docsList: [] as string[],
};

const CreateModalReducer = (
    state = initialState,
    action: { type: string; payload?: any }
) => {
    switch (action.type) {
        case "ADD_TRUE":
            return { ...state, add: true };

        case "ADD_FALSE":
            return { ...state, add: false };

        case "ADD":
            return { ...state, docsList: action.payload };

        default:
            return state;
    }
};

export default CreateModalReducer;

/* ===========================
   ASYNC ACTIONS
   =========================== */

// ✅ Ensure directory exists
const ensureTikDir = async () => {
    const dirInfo = await FileSystem.getInfoAsync(tikDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(tikDir, { intermediates: true });
    }
};

// ✅ Load files safely
export const ADD = () => async (dispatch: any) => {
    try {
        await ensureTikDir(); // <<< IMPORTANT FIX

        const files = await FileSystem.readDirectoryAsync(tikDir);
        const fullPaths = files.map(f => tikDir + f);

        dispatch({ type: "ADD", payload: fullPaths });
    } catch (error) {
        console.error("Error reading directory:", error);
        dispatch({ type: "ADD", payload: [] });
    }
};

export const ADD_TRUE = () => (dispatch: any) =>
    dispatch({ type: "ADD_TRUE" });

export const ADD_FALSE = () => (dispatch: any) =>
    dispatch({ type: "ADD_FALSE" });






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