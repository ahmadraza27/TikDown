import React, { Component } from 'react'
import { Text, View, Button, Modal, TouchableOpacity, StatusBar, FlatList, ScrollView, Share } from 'react-native'
import { connect } from "react-redux";
import { ADD_FALSE } from '../../redux/actions/addReducer';
// import gradient
import { LinearGradient } from 'expo-linear-gradient';
// import bottom navigation
import * as NavigationBar from 'expo-navigation-bar';
// for file handling
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';
import { button_view, mian_heading, mian_text_view, mian_view } from '../../styles';
// import sharing
import * as Sharing from 'expo-sharing';
import MaskedView from '@react-native-masked-view/masked-view';

const tikDir = FileSystem.documentDirectory + 'tikDown/';
// const tikDir = FileSystem.documentDirectory ;
export class History extends Component<{ add: { add: string, docsList: string }, ADD_FALSE: () => void }, { docsList: any, loading: boolean, add: boolean, video: any }>{
    tikDir = FileSystem.documentDirectory + 'tikDown/';


    constructor(props: any) {
        super(props);
        this.state = {
            docsList: [],
            loading: true,
            add: false,
            video: []
        }

    }


    componentDidMount(): void {
        // console.log(this.props?.add?.add)

        const a = async () => {
            // console.log("history")
            const color = await NavigationBar.getBackgroundColorAsync();
            NavigationBar.setBackgroundColorAsync("black")
            // console.log(color, "of history")

        }
        a();

    }

    l = () => {
        // console.log(this.props?.add?.add)

        // console.log(this.props?.add?.docsList)
    }
    Show = () => {
        // console.log(this.props?.add?.add)

        return (<>
            <ScrollView className=''>
                {this.props?.add?.docsList["_j"].map((i: string, index: number) => {
                    return (
                        



                            <View key={index} className='flex-col justify-center items-center py-3 rounded-3xl m-2'>
                                <Video
                                    className='rounded-xl overflow-hidden'
                                    source={{ uri: tikDir + i.slice(52, -1) }}
                                    rate={1.0}
                                    volume={1.0}
                                    isMuted={false}
                                    resizeMode="cover"
                                    shouldPlay={false}
                                    isLooping={false}
                                    useNativeControls
                                    style={{ width: 300, height: 200 }}
                                />
                                <Text className='text-white' key={index}>{i.slice(52, -5).length > 20 ? i.slice(52, -5).slice(0, 20) : i.slice(52, -5)}</Text>
                                <TouchableOpacity onPress={() => {
                                    (async function () {
                                        try {
                                            const result = await Sharing.shareAsync(
                                                tikDir + i.slice(52, -1),
                                            );

                                        } catch (error) {
                                            console.error('Error sharing video:', error);
                                        }
                                    })();
                                }}>


                                    <MaskedView maskElement={<Text className=''> Share</Text>}>
                                        <LinearGradient
                                            colors={['#EE1D52', '#FFFFFF', '#69C9D0']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text className=''>              </Text>
                                        </LinearGradient>
                                    </MaskedView>


                                </TouchableOpacity>
                            </View>

                        
                    )
                })

                }
                <View className='py-20'></View>
            </ScrollView>
        </>)
    }
    render() {
        return (
            <>
                <Modal
                    animationType={'slide'}
                    visible={this.props.add.add}
                    onRequestClose={this.props.ADD_FALSE}
                    presentationStyle='formSheet'
                >
                    <StatusBar backgroundColor='black' barStyle='light-content' />


                    <View className={`${mian_view} bg-black`}>
                        <View className={`${mian_text_view} py-4`}>
                            <Text className={`${mian_heading} text-white`}>HISTORY </Text>
                            <MaskedView maskElement={<Text className='w-full'>Your </Text>}>
                                <LinearGradient
                                    colors={['#EE1D52', '#FFFFFF', '#69C9D0']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text className='w-full'>         </Text>
                                </LinearGradient>
                            </MaskedView>
                            <MaskedView maskElement={<Text className='w-full'>Downloads</Text>}>
                                <LinearGradient
                                    colors={['#EE1D52', '#FFFFFF', '#69C9D0']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text className='w-full'>                      </Text>
                                </LinearGradient>
                            </MaskedView>

                        </View>
                        <View>

                            <this.Show />


                        </View>

                        <View className='absolute bottom-5 w-[80%] mx-[10%] flex-row justify-center items-center '>
                            <TouchableOpacity className={`${button_view} p-0 overflow-hidden  w-[80%] mx-[10%] `} onPress={() => {
                                this.props.ADD_FALSE();
                                this.l()
                            }} >
                                <LinearGradient className='w-full h-full py-2 justify-center items-center ' start={{ x: 0, y: 0.5 }} colors={['#EE1D52', '#FFFFFF', '#69C9D0']} >

                                    <Text className=" font-bold tracking-widest">Close</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}
const mapStateToProps = (state: { docsList: any, loading: boolean, add: boolean }) => {
    return {
        add: state.add,

    };
};

export default connect(mapStateToProps, { ADD_FALSE })(History)
