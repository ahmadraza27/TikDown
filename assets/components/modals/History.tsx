import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Sharing from "expo-sharing";
import * as NavigationBar from "expo-navigation-bar";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";

// Redux actions
import { ADD_FALSE } from "../../redux/actions/addReducer";

interface Props {
  add: { add: boolean }; // Visibility state from Redux
  ADD_FALSE: () => void;
}

interface State {
  localFiles: string[];
}

class History extends Component<Props, State> {
  // Path must match exactly what you used in Index.tsx
  tikDir = FileSystem.documentDirectory + "tikDown/";

  constructor(props: Props) {
    super(props);
    this.state = {
      localFiles: [],
    };
  }

  async componentDidUpdate(prevProps: Props) {
    // When the modal becomes visible, refresh the file list
    if (this.props.add.add && !prevProps.add.add) {
      this.refreshHistory();
    }
  }

  async componentDidMount() {
    if (Platform.OS === "android") {
      await NavigationBar.setBackgroundColorAsync("black");
    }
    this.refreshHistory();
  }

  refreshHistory = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.tikDir);
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(this.tikDir);
        // Convert filenames to full URIs and filter for mp4s
        const videoFiles = files
          .filter((file) => file.endsWith(".mp4"))
          .map((file) => this.tikDir + file);
        
        this.setState({ localFiles: videoFiles.reverse() }); // Newest first
      }
    } catch (error) {
      console.error("Error reading history directory:", error);
    }
  };

  handleShare = async (fileUri: string) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "video/mp4",
          uti: "public.mpeg-4",
        });
      }
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  renderItem(file: string, index: number) {
    const filename = file.split("/").pop() ?? "TikTok Video";

    return (
      <View key={index} style={styles.card}>
        <Video
          source={{ uri: file }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
          shouldPlay={false}
        />

        <Text numberOfLines={1} style={styles.fileName}>
          {filename.replace(/_/g, " ").replace(".mp4", "")}
        </Text>

        <TouchableOpacity onPress={() => this.handleShare(file)}>
          <MaskedView
            maskElement={<Text style={styles.shareText}>SHARE VIDEO</Text>}
          >
            <LinearGradient
              colors={["#EE1D52", "#FFFFFF", "#69C9D0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.shareText, { opacity: 0 }]}>SHARE VIDEO</Text>
            </LinearGradient>
          </MaskedView>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { add } = this.props.add;

    return (
      <Modal
        visible={add}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={this.props.ADD_FALSE}
      >
        <StatusBar barStyle="light-content" backgroundColor="black" />

        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
              <MaskedView
                maskElement={<Text style={styles.title}>HISTORY</Text>}
              >
                <LinearGradient
                  colors={["#EE1D52", "#FFFFFF", "#69C9D0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.title, { opacity: 0 }]}>HISTORY</Text>
                </LinearGradient>
              </MaskedView>
            </View>

            {/* CONTENT */}
            <ScrollView
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {this.state.localFiles.length > 0 ? (
                this.state.localFiles.map((f, i) => this.renderItem(f, i))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.empty}>No downloads found</Text>
                  <Text style={styles.emptySub}>Videos you download will appear here.</Text>
                </View>
              )}
            </ScrollView>

            {/* CLOSE BUTTON */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={this.props.ADD_FALSE}
                style={styles.closeBtn}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#EE1D52", "#FFFFFF", "#69C9D0"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.closeGradient}
                >
                  <Text style={styles.closeText}>CLOSE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const mapStateToProps = (state: any) => ({
  add: state.add,
});

export default connect(mapStateToProps, { ADD_FALSE })(History);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  video: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    backgroundColor: "#000",
  },
  fileName: {
    color: "#f8fafc",
    marginTop: 12,
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  shareText: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
    letterSpacing: 1,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  empty: {
    color: "#64748b",
    fontSize: 18,
    fontWeight: "700",
  },
  emptySub: {
    color: "#475569",
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  closeGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
});
