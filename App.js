import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './src/screens/SearchScreen';
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import DataScreen from './src/screens/DataScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { createDatabase } from './src/utils/schema';
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const initialize = async (db) => {

  createDatabase(db)
    .then(() => console.log('✅ Database tables created/verified.'))
    .catch(error => console.error('❌ Failed to initialize database tables:', error));
};

export default function App() {
  const [db, setDb] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    if (!dbInitialized) {
      const dbConnection = SQLite.openDatabaseSync('ingredientdb');
      setDb(dbConnection);
      initialize(dbConnection).finally(() => {
        setDbInitialized(true);
      });
    }
    console.log('Database connection opened.');
  }, []);

  useDrizzleStudio(db);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Initializing database...</Text>
      </View>
    );
  }

  function Tabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Search') {
              iconName = 'search';
            } else if (route.name === 'Camera') {
              iconName = 'camera';
            } else {
              iconName = 'help';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="DataScreen" component={DataScreen} options={{ title: 'Item Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}