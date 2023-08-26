import { View, Text,Platform,Alert } from 'react-native'
// import connect 
import { connect } from 'react-redux'
import { ADD_TRUE } from '../../assets/redux/actions/addReducer'

// import icon
import { MaterialIcons } from '@expo/vector-icons';
import React,{useRef,useState,useEffect} from 'react'
import { Stack } from 'expo-router'
import { Drawer } from 'expo-router/drawer'

// import gradient
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
// import bottom navigation
import * as NavigationBar from 'expo-navigation-bar';


const _layout = ({ ADD_TRUE }: { ADD_TRUE: any }) => {

	(async function () {
		// console.log("history")
		const color = await NavigationBar.getBackgroundColorAsync();
		NavigationBar.setBackgroundColorAsync("black")
		// console.log(color, "of history")

	})()


    return (
        <>
            <Stack.Screen options={{

            }} />
            <Drawer >
                <Drawer.Screen name='index' options={{
                    headerTitle: (props) => (
                        <View className=" w-[150%]  -ml-4  pt-2">
                            <MaskedView maskElement={<View className='justify-center items-center  '><Text className='text-2xl font-bold'>TikDown</Text></View>}>
                                <LinearGradient
                                     colors={['#EE1D52', '#FFFFFF', '#69C9D0']}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                >
                                    <Text className='  h-full'>                             </Text>
                                </LinearGradient>
                            </MaskedView>
                        </View>),
                    // headerTitleStyle:{
                    //     color:'white',
                    // },
                    // headerStyle: {
                    //     // backgroundColor: 'black',
                    //     elevation: 0,


                    // },
                    headerTitleAlign: 'center',
                    swipeEnabled: false,
                    headerLeft(props) {
                        return <View className="pl-3"><MaterialIcons name="history" size={24} color="#69C9D0" onPress={() => {


                            ADD_TRUE()
                        }}/></View>
                    },
                    headerBackground(props) {

                        return (
                            <View className="h-full bg-black ">
                    
                            </View>)
                    },

                }} />


            </Drawer>

        </>
    )
}

export default connect(null, { ADD_TRUE })(_layout)