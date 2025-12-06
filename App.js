import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import TasksScreen from './src/screens/TasksScreen';
import NotesScreen from './src/screens/NotesScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Tasks') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Notes') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'Habits') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Configuracion') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Tasks" component={TasksScreen} />
            <Tab.Screen name="Notes" component={NotesScreen} />
            <Tab.Screen name="Habits" component={HabitsScreen} />
            <Tab.Screen name="Configuracion" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{headerShown: false}} 
          />
        ) : (
          <Stack.Screen 
              name="Main" 
              component={MainTabs} 
              options={{headerShown: false}} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNav />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
