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
// import firebase dependensies for notification
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});
async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
const _layout = ({ ADD_TRUE }: { ADD_TRUE: any }) => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        (async function () {
            // console.log("history")
            const color = await NavigationBar.getBackgroundColorAsync();
            NavigationBar.setBackgroundColorAsync("black")
            // console.log(color, "of history")
    
        })()
    
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    
    useEffect(() => {
        Alert.alert("expo push token ", `${expoPushToken}`)
        console.log(`your expo token ------------- ${expoPushToken}`)

    }, [expoPushToken])

   



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