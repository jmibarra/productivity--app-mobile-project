import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useCallback, useState } from 'react'; // Removed useEffect

import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Switch } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getTasks, updateTask } from '../services/api'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TasksScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [showUncompletedOnly, setShowUncompletedOnly] = useState(false);

    const fetchTasks = async (pageNum, shouldRefresh = false) => {
        if (!hasMore && !shouldRefresh) return;
        
        try {
            if (shouldRefresh) setLoading(true); // Initial load or refresh
            else setLoadingMore(true);

            const data = await getTasks(pageNum, 10);
            const newTasks = data.tasks || [];
            
            if (shouldRefresh) {
                setTasks(newTasks);
            } else {
                setTasks(prev => {
                    const existingIds = new Set(prev.map(t => t._id));
                    const uniqueNewTasks = newTasks.filter(t => !existingIds.has(t._id));
                    return [...prev, ...uniqueNewTasks];
                });
            }

            setHasMore(newTasks.length === 10); // Assume 10 is limit
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setPage(1);
            setHasMore(true);
            fetchTasks(1, true); // Reset and load page 1
        }, [])
    );

    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchTasks(nextPage, false);
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
            alert('Failed to update task');
            // Reverting optimistic update requires finding the original task state, simplistic log here
        }
    };

    const filteredTasks = showUncompletedOnly 
        ? tasks.filter(task => !task.completed) 
        : tasks;

    const getPriorityDetails = (priority) => {
        switch (priority) {
            case 1: return { icon: 'alert-circle', color: '#FF3B30', label: 'Alta' }; // Red
            case 2: return { icon: 'arrow-down-circle', color: '#FF9500', label: 'Media' }; // Orange
            case 3: return { icon: 'snow', color: '#007AFF', label: 'Baja' }; // Blue
            default: return { icon: 'help-circle', color: '#8E8E93', label: 'Ninguna' }; // Grey
        }
    };

    const renderItem = ({ item }) => {
        const { icon, color } = getPriorityDetails(item.priority);

        return (
            <View style={[styles.card, item.completed && styles.cardCompleted]}>
                <TouchableOpacity 
                    onPress={() => handleToggleComplete(item)}
                    style={styles.checkboxContainer}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase hit area
                >
                     <Ionicons 
                        name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                        size={28} 
                        color={item.completed ? "#999" : "#007AFF"} 
                    />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cardContent}
                    onPress={() => navigation.navigate('TaskDetail', { task: item })}
                    activeOpacity={0.7}
                >
                    <View style={styles.textContainer}>
                        <View style={styles.titleRow}>
                            <Text style={[styles.taskTitle, item.completed && styles.textCompleted]}>
                                {item.title || 'No Title'}
                            </Text>
                            <Ionicons name={icon} size={18} color={color} style={styles.priorityIcon} />
                        </View>
                        {item.description ? (
                            <Text style={[styles.taskDesc, item.completed && styles.textCompleted]} numberOfLines={2}>
                                {item.description}
                            </Text>
                        ) : null}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

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
                    keyExtractor={(item) => item._id ? item._id.toString() : Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tasks found</Text>}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} /> : null}
                    refreshing={refreshing}
                    onRefresh={() => {
                        setRefreshing(true);
                        setPage(1);
                        setHasMore(true);
                        fetchTasks(1, true);
                    }}
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
    // ...
    listContent: {
        padding: 20,
        paddingBottom: 100, // Ensure last item is visible above Tab Bar
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardCompleted: {
        backgroundColor: '#f9f9f9', // Slightly grayer background
        opacity: 0.8,
    },
    checkboxContainer: {
        padding: 5,
        marginRight: 10,
    },
    cardContent: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    priorityIcon: {
        marginLeft: 8,
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
