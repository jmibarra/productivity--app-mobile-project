import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getTasks, updateTask } from '../services/api'; // Import updateTask
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TasksScreen = () => {
    const { userInfo } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUncompletedOnly, setShowUncompletedOnly] = useState(false); // Filter state

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

    const handleToggleComplete = async (task) => {
        try {
            // Optimistic Update
            const updatedTasks = tasks.map(t => 
                t._id === task._id ? { ...t, completed: !t.completed } : t
            );
            setTasks(updatedTasks);

            // API Call
            await updateTask(task._id, { completed: !task.completed });
        } catch (e) {
            console.log('Error updating task:', e);
            // Revert changes if API fails (optional but good practice)
            loadTasks(); 
        }
    };

    const filteredTasks = showUncompletedOnly 
        ? tasks.filter(task => !task.completed) 
        : tasks;

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.card, item.completed && styles.cardCompleted]} 
            onPress={() => handleToggleComplete(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                 <Ionicons 
                    name={item.completed ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={item.completed ? "#999" : "#007AFF"} 
                    style={styles.checkbox}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.taskTitle, item.completed && styles.textCompleted]}>
                        {item.title || 'No Title'}
                    </Text> 
                    {item.description ? (
                        <Text style={[styles.taskDesc, item.completed && styles.textCompleted]}>
                            {item.description}
                        </Text>
                    ) : null}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Tasks</Text>
                <View style={styles.filterContainer}>
                    <Text style={styles.filterText}>Show Uncompleted Only</Text>
                    <Switch 
                        value={showUncompletedOnly}
                        onValueChange={setShowUncompletedOnly}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={showUncompletedOnly ? "#007AFF" : "#f4f3f4"}
                    />
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList 
                    data={filteredTasks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()} // Use _id from Mongo
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
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        marginRight: 10,
        color: '#666',
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
        borderRadius: 12, // Rounded corners as requested ("De preferencia redondeado")
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardCompleted: {
        backgroundColor: '#f9f9f9', // Slightly grayer background
        opacity: 0.8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    taskDesc: {
        color: '#666',
        fontSize: 14,
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#999',
    },
});

export default TasksScreen;
