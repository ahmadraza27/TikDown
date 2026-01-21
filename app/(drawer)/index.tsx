import React from "react";
import {
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
// Using /legacy to support getInfoAsync in Expo SDK 54+
import * as FileSystem from "expo-file-system/legacy";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { shareAsync } from "expo-sharing";
import MaskedView from "@react-native-masked-view/masked-view";
import axios from 'axios';

// Redux actions
import { ADD } from "../../assets/redux/actions/addReducer";

// History modal
import HistoryModal from "../../assets/components/modals/History";

type Props = {
  ADD: () => void;
};
type State = {
  url: string;
  historyVisible: boolean;
  isDownloading: boolean;
};

class Index extends React.Component<Props, State> {
  tikDir = FileSystem.documentDirectory + "tikDown/";

  constructor(props: Props) {
    super(props);
    this.state = {
      url: "",
      historyVisible: false,
      isDownloading: false,
    };
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      await NavigationBar.setBackgroundColorAsync("black");
    }
  }

  ensureDirExists = async () => {
    const dir = await FileSystem.getInfoAsync(this.tikDir);
    if (!dir.exists) {
      await FileSystem.makeDirectoryAsync(this.tikDir, {
        intermediates: true,
      });
    }
  };

  downloadVideo = async (videoUrl: string, title: string) => {
    try {
      await this.ensureDirExists();

      // Clean filename for iOS/Android filesystem
      const cleanTitle = title
        .replace(/[^\w]/gi, "_") 
        .substring(0, 25);

      const fileUri = this.tikDir + `${cleanTitle}_${Date.now()}.mp4`;

      console.log("Attempting download:", videoUrl);

      // Create a resumable download - highly recommended for iOS stability
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUrl,
        fileUri,
        {
          headers: {
            'Accept': '*/*',
            // Modern iOS Safari User Agent to bypass bot detection
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          },
        }
      );

      const result = await downloadResumable.downloadAsync();

      if (!result || result.status !== 200) {
        throw new Error(`Server returned status ${result?.status}`);
      }

      console.log("Download finished:", result.uri);

      // Sharing/Saving logic
      if (Platform.OS === "ios") {
        await shareAsync(result.uri, {
          uti: 'public.mpeg-4',
          mimeType: 'video/mp4',
        });
      } else {
        await shareAsync(result.uri);
      }

      this.props.ADD();
      this.setState({ isDownloading: false, url: "" });
      Alert.alert("Success", "Video downloaded successfully!");

    } catch (error) {
      this.setState({ isDownloading: false });
      console.error("Download Error:", error);
      Alert.alert("Download Failed", "The video server refused the connection. This often happens on iOS with certain links.");
    }
  };

  getVideoData = async () => {
    if (!this.state.url.trim()) {
      Alert.alert("Missing URL", "Please enter a TikTok URL");
      return;
    }

    this.setState({ isDownloading: true });

    try {
      // Clean the URL of tracking parameters
      const cleanUrl = this.state.url.split('?')[0];

      const options = {
        method: 'GET',
        url: 'https://tiktok-video-downloader-api.p.rapidapi.com/media',
        params: { videoUrl: cleanUrl },
        headers: {
          'x-rapidapi-key': '108855b2femsha140236ecc32189p1cb2acjsn6e5f1b9cd140',
          'x-rapidapi-host': 'tiktok-video-downloader-api.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      console.log("API Response:", response.data);

      if (response.data && response.data.downloadUrl) {
        const title = response.data.description || "tiktok_video";
        await this.downloadVideo(response.data.downloadUrl, title);
      } else {
        this.setState({ isDownloading: false });
        Alert.alert("API Error", "No download link found for this video.");
      }

    } catch (error: any) {
      this.setState({ isDownloading: false });
      console.log("API Error Details:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch video data. Please check your link.");
    }
  };

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="black" />

        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.heading}>TikTok Downloader</Text>
            <MaskedView maskElement={<Text style={styles.sub}>History</Text>}>
              <LinearGradient
                colors={["#EE1D52", "#FFFFFF", "#69C9D0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.subHidden}>History</Text>
              </LinearGradient>
            </MaskedView>
          </View>

          <View style={styles.inputBox}>
            <TextInput
              value={this.state.url}
              onChangeText={(url) => this.setState({ url })}
              placeholder="Paste TikTok URL here"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              multiline
              editable={!this.state.isDownloading}
            />
          </View>

          <TouchableOpacity
            style={[styles.downloadBtn, this.state.isDownloading && { opacity: 0.6 }]}
            onPress={this.getVideoData}
            disabled={this.state.isDownloading}
          >
            <LinearGradient
              colors={["#EE1D52", "#FFFFFF", "#69C9D0"]}
              style={styles.gradient}
            >
              <Text style={styles.downloadText}>
                {this.state.isDownloading ? "PROCESSING..." : "DOWNLOAD"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => this.setState({ historyVisible: true })}
          >
            <Text style={styles.historyText}>View History</Text>
          </TouchableOpacity>

          <HistoryModal
            visible={this.state.historyVisible}
            onClose={() => this.setState({ historyVisible: false })}
          />
        </View>
      </>
    );
  }
}

export default connect(null, { ADD })(Index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 70,
    marginBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  sub: {
    fontSize: 16,
    fontWeight: "600",
  },
  subHidden: {
    opacity: 0,
  },
  inputBox: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  input: {
    color: "#fff",
    fontSize: 16,
    minHeight: 50,
  },
  downloadBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  downloadText: {
    fontWeight: "800",
    letterSpacing: 1,
    color: "#000",
  },
  historyBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  historyText: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "600",
  },
});




// import { StatusBar, View, Text, Button, TextInput, Platform, TouchableOpacity, Alert, ImageBackground } from 'react-native'
// // import drawer navigator
// import { Drawer } from 'expo-router/drawer'
// // importing hooks
// import React, { useState } from 'react'

//   // "node-tiklydown": "^1.0.0",
// // module for getting tiktok data
// const { v1 } = require("node-tiklydown");

// // for file handling
// import * as FileSystem from 'expo-file-system';
// // import * as MediaLibrary from 'expo-media-library';
// // import { Video } from 'expo-av';
// // import gradient
// import { LinearGradient } from 'expo-linear-gradient';
// import { shareAsync } from 'expo-sharing';
// // import custom styles 
// import { mian_heading, mian_view, mian_text_view, mian_text_input_view, button_view, button } from '../../assets/styles';
// // import bottom navigation
// import * as NavigationBar from 'expo-navigation-bar';
// // import history modal
// import History from '../../assets/components/modals/History';
// // import redux 
// import { ADD_TRUE,ADD } from '../../assets/redux/actions/addReducer';

// import { connect } from "react-redux";
// // import masked View
// import MaskedView from '@react-native-masked-view/masked-view';
// // import image 
// const image = require('../../assets/images/p5.jpg')
// // get permissions 
// // import * as Permissions from 'expo-permissions';
// // import RNFetchBlob from 'rn-fetch-blob';
// // specifying types for typescript errors
// type videoInfo = {
//     video: {
//         noWatermark: string,

//     },
//     title: string,

// }
// function handleError(e: unknown) {
//     throw new Error('Function not implemented.');
// }
// class index extends React.Component<{ ADD_TRUE: any, ADD: any, ADD_FALSE: any }, { url: string, downloadProgress: number, docsList: any, videos: any, loading: boolean }> {
//     tikDir = FileSystem.documentDirectory + 'tikDown/';
//     constructor(props: any) {
//         super(props)

//         this.state = {
//             url: '',
//             downloadProgress: 0,
//             docsList: [],
//             videos: [],
//             loading: true

//         }
//     }
//     componentDidMount(): void {
//         // const requestPermissions = async () => {
//         //     if (Platform.OS === 'android') {
//         //       const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY_WRITE_ONLY);
//         //       if (status !== 'granted') {
//         //         console.log('Permission denied');
//         //       }
//         //     }
//         //   };
//         //   requestPermissions()
//         const a = async () => {
//             const color = await NavigationBar.getBackgroundColorAsync();
//             // console.log(color, "index")
//             NavigationBar.setBackgroundColorAsync("black")
//             await NavigationBar.setBehaviorAsync('inset-swipe')
//         }
//         a()
//     }
//     // downloadAndSaveVideo = async (videoUrl: string, title: string) => {
//     //     console.log("startingto download")
//     //     title = title.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replace(/\s+/g, ' ').trim().replace(/#/g, '')
//     //     console.log("going")
//     //     const filename = `video1.mp4`;
//     //     if (Platform.OS === "android") {

//     //         const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//     //         if (permissions.granted) {
//     //             console.log("downloading")
//     //             const { uri } = await FileSystem.downloadAsync(
//     //                 videoUrl,
//     //                 FileSystem.documentDirectory + 'myvideo.mp4'
//     //               );
//     //             console.log("creating asset",uri)
//     //               const asset = await MediaLibrary.createAssetAsync(uri);
//     //               console.log("creating album")
//     //               await MediaLibrary.createAlbumAsync('MyVideos', asset, false);
//     //               console.log("album created")
//     //         }
//     //     }
//     // }
//     // download the video from the server
//     downloadVideo = async (data: string, title: string) => {
//         title = title.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').replace(/\s+/g, ' ').trim().replace(/#/g, '')
//         // console.log("going")
//         const filename = `${title}.mp4`;
//         // console.log("file name :" + filename)
//         // console.log("title :" + title)
//         // const filename =`vid.mp4`;
//         const result = await FileSystem.downloadAsync(
//             data,
//             this.tikDir + filename
//         );
//         // console.log(result);
//         // console.log("saving...");
//         this.save(result.uri, filename, result.headers["Content-Type"]);
//         // this.save1(result.uri, filename, result.headers["Content-Type"],data);
//     }

//     // save1 = async (uri: string, filename: string, mimetype: any,data:string) => {
//     //     const callback = (downloadProgress:any)=> {
//     //         const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
//     //         this.setState({
//     //             downloadProgress: progress,
//     //         });
//     //     };

//     //     let downloadResumable = FileSystem.createDownloadResumable(
//     //         data,
//     //         FileSystem.documentDirectory + 'small.mp4',
//     //         {},
//     //         callback
//     //     );

//     //     try {
//     //         const { uri } = await downloadResumable.downloadAsync();
//     //         console.log('Finished downloading to ', uri);
//     //     } catch (e) {
//     //         console.error(e);
//     //     }

//     //     try {
//     //         await downloadResumable.pauseAsync();
//     //         console.log('Paused download operation, saving for future retrieval');
//     //         AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadResumable.savable()));
//     //     } catch (e) {
//     //         console.error(e);
//     //     }

//     //     try {
//     //         const { uri } = await downloadResumable.resumeAsync();
//     //         console.log('Finished downloading to ', uri);
//     //     } catch (e) {
//     //         console.error(e);
//     //     }

//     //     //To resume a download across app restarts, assuming the DownloadResumable.savable() object was stored:
//     //     const downloadSnapshotJson = await AsyncStorage.getItem('pausedDownload');
//     //     const downloadSnapshot = JSON.parse(downloadSnapshotJson);
//     //     downloadResumable = new FileSystem.DownloadResumable(
//     //         downloadSnapshot.url,
//     //         downloadSnapshot.fileUri,
//     //         downloadSnapshot.options,
//     //         callback,
//     //         downloadSnapshot.resumeData
//     //     );

//     //     try {
//     //         const { uri } = await downloadResumable.resumeAsync();
//     //         console.log('Finished downloading to ', uri);
//     //     } catch (e) {
//     //         console.error(e);
//     //     }
//     // };
//     ensureDirExists = async () => {
//         const dirInfo = await FileSystem.getInfoAsync(this.tikDir);
//         if (!dirInfo.exists) {
//             // console.log("Gif directory doesn't exist, creating...");
//             await FileSystem.makeDirectoryAsync(this.tikDir, { intermediates: true });
//             // console.log("created directory")
//         }
//     }
//     // save the video to specif directory
//     save = async (uri: string, filename: string, mimetype: any) => {
//         this.ensureDirExists()
//         if (Platform.OS === "android") {
//             const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//             if (permissions.granted) {
//                 const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
//                 await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
//                     .then(async (uri) => {
//                         await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
//                         // console.log("saved")
//                     })
//                     .catch(e => console.log(e));
//             } else {
//                 shareAsync(uri);
//             }
//         } else {
//             shareAsync(uri);
//         }
//         this.props.ADD()
//         // this.dispatch({type: 'addToggle'})

//     };
//     // get video data such as download link from module
//     getVideoData = async (url: string) => {
//         // console.log("getting data")
//         if (url.length > 0) {
//             v1(url).then((data: videoInfo) => {
//                 // console.log('hi ok done', data['video']['noWatermark'])
//                 // console.log(data['title'])
//                 // console.log(FileSystem.documentDirectory)
//                 this.downloadVideo(data['video']['noWatermark'], data['title'])
//             });
//         }
//         else {
//             console.log('no url')
//             Alert.alert("URL Missing", "Enter A URL")
//         }
//     }
//     toggle() {
//         this.props.ADD_TRUE()
//     }

//     render() {
//         return (
//             <>
//                 {/* specifying options for main drawer page */}
//                 <StatusBar backgroundColor='black' barStyle='light-content' />
//                 <View className={`${mian_view} bg-black`}>
//                     {/* mian heading */}
//                     {/* <ImageBackground className='h-[110%] -top-5' source={image}> */}
//                     <View className={`${mian_text_view} mt-14 ml-7`}>
//                         <Text className={` ${mian_heading} text-white`}>Download From Any URL </Text>
//                     </View>
//                     {/* input area for link */}
//                     <View className={`${mian_text_input_view} bg-gray-800 w-[80%] mx-[10%]`}>
//                         <TextInput className={`pl-2 pb-1`} value={this.state.url}
//                             multiline
//                             onChangeText={val => this.setState({ url: val })}
//                             placeholderTextColor={"white"}

//                             placeholder='Enter URL Here' />
//                     </View>
//                     {/* button area */}
//                     <History />
//                     <TouchableOpacity className={`${button_view} absolute bottom-14  w-[80%] mx-[10%] p-0 overflow-hidden`} onPress={() => this.getVideoData(this.state.url)}>
//                         <LinearGradient className='w-full h-full flex justify-center items-center py-2' start={{ x: 0, y: 0.5 }} colors={['#EE1D52', '#FFFFFF', '#69C9D0']} >
//                             <Text className={`${button}  font-bold tracking-widest `}>Download</Text>

//                         </LinearGradient>
//                     </TouchableOpacity>
//                     {/* </ImageBackground> */}

//                 </View>
//             </>
//         )
//     }
// }

// export default connect(null, { ADD_TRUE, ADD })(index)

