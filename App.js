import React, { useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
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
import TaskDetailScreen from './src/screens/TaskDetailScreen'; // Detail Screen

import CreateOptionsModal from './src/components/CreateOptionsModal';
import CreateTaskScreen from './src/screens/CreateTaskScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#007AFF', // Primary Color
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

const MainTabs = ({ navigation }) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleSelectOption = (option) => {
        setModalVisible(false);
        if (option === 'Task') {
            navigation.navigate('CreateTask');
        } else {
            console.log('Selected:', option);
            // Future: Navigate to CreateNote or CreateHabit
        }
    };

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#007AFF',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: '#fff',
                        borderTopWidth: 0,
                        elevation: 0,
                        height: 60, // Increase height slightly
                        ...styles.shadow
                    },
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
                    tabBarShowLabel: false, // Hide labels for cleaner look
                })}
            >
                <Tab.Screen name="Tasks" component={TasksScreen} />
                <Tab.Screen name="Notes" component={NotesScreen} />
                
                <Tab.Screen 
                    name="Create" 
                    component={View} // Dummy component
                    options={{
                        tabBarIcon: ({ focused }) => (
                             <Ionicons name="add" size={40} color="#fff" />
                        ),
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props} onPress={() => setModalVisible(true)} />
                        )
                    }}
                />

                <Tab.Screen name="Habits" component={HabitsScreen} />
                <Tab.Screen name="Configuracion" component={SettingsScreen} />
            </Tab.Navigator>

            <CreateOptionsModal 
                visible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                onSelect={handleSelectOption}
            />
        </>
    );
}

const styles = {
    shadow: {
        shadowColor: '#7F5DF0',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
};

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
          <>
            <Stack.Screen 
                name="Main" 
                component={MainTabs} 
                options={{headerShown: false}} 
            />
            <Stack.Screen 
                name="TaskDetail" 
                component={TaskDetailScreen}
                options={{ 
                    headerShown: true, // Show header for back button
                    headerTitle: '', // Minimal header
                    headerBackTitle: 'Back'
                }} 
            />
            <Stack.Screen 
                name="CreateTask" 
                component={CreateTaskScreen}
                options={{ headerShown: false }} // Custom header in screen
            />
          </>
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
