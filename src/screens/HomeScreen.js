import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getTasks } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const { logout, userInfo } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.taskTitle}>{item.title || 'No Title'}</Text> 
            {/* Adjust item.title based on actual API response structure */}
            <Text style={styles.taskDesc}>{item.description || 'No Description'}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Hello, {userInfo?.name || 'User'}</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList 
                    data={tasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 5,
    },
    logoutText: {
        color: '#ff3b30',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    taskDesc: {
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
});

export default HomeScreen;
