import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
// import hooks
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
// import redux provider
import { Provider } from 'react-redux';
//  import store
import store from '../assets/redux/store';
// import bottom navigation
import * as NavigationBar from 'expo-navigation-bar';


export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const a = async () => {
		console.log("history")
		const color = await NavigationBar.getBackgroundColorAsync();
		NavigationBar.setBackgroundColorAsync("black")
		console.log(color, "of history")

	}
	a();
	return (
		<>
			<Provider store={store}>
				<Stack>
					<Stack.Screen name="(drawer)" options={{
						headerShown: false,
					}} />
				</Stack>
			</Provider>
		</>

	);
}
