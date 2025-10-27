import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation } from '@react-navigation/native';
import SearchScreen from './components/SearchScreen';
import HomeScreen from './components/HomeScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({  // Navigator can be customized using screenOptions
          tabBarIcon: ({ focused, color, size }) => {
            // Function tabBarIcon is given the focused state,
            // color and size params
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search';
            }

            return <Ionicons name={iconName} size={size} color={color} />;   //it returns an icon component
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    </NavigationContainer>);
}