
// for file handling
import * as FileSystem from 'expo-file-system';
let dlist: string[] = [];
const tikDir = FileSystem.documentDirectory + 'tikDown/';

const _getAllFilesInDirectory = async () => {
    dlist =[];
    let dir = await FileSystem.readDirectoryAsync(tikDir);

    dir.forEach((val,i,ii) => {
        // console.log("add reducer reducer ",val)
        dlist.push(tikDir + val + "\n");
    })
    // console.log(dlist)
    return dlist;

}
const initialState = {
    add: false,
    docsList:  _getAllFilesInDirectory(),
}



const CreateModalReducer = (state = initialState, action: { type: string }) => {
    switch (action.type) {
        case "ADD_TRUE":
            // console.log("taggled add", state.add)
            return {
                ...state,
                add: true
            }
        case "ADD_FALSE":
            // console.log("taggled add", state.add)
            return {
                ...state,
                add: false
            }
        case "ADD":
            // console.log("taggled popp", state.docsList)
            // _getAllFilesInDirectory()
            // if (_getAllFilesInDirectory() != state.docsList){  
            return {
                ...state,
                docsList: _getAllFilesInDirectory()

            }

        default:
            return {
                ...state,
            }

    }
}

export default CreateModalReducer