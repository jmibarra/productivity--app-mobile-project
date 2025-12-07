import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useCallback, useState } from 'react'; // Removed useEffect

import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getTasks, updateTask, getLists } from '../services/api'; 
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

    // List Filtering State
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('all');

    const fetchTasks = async (pageNum, shouldRefresh = false) => {
        if (!hasMore && !shouldRefresh) return;
        
        try {
            if (shouldRefresh) setLoading(true); 
            else setLoadingMore(true);

            // Fetch tasks filtered by selectedListId
            const data = await getTasks(pageNum, 10, 'createdAt', 'desc', selectedListId);
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

            setHasMore(newTasks.length === 10);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    const fetchUserLists = async () => {
        try {
            const userLists = await getLists(); // Renamed to avoid confusion with local var
            setLists(userLists);
        } catch (e) {
            console.log("Error fetching lists", e);
        }
    }

    // Handle List Selection
    const handleListSelect = (listId) => {
        if (selectedListId === listId) return;
        setSelectedListId(listId);
        // Effect will trigger fetchTasks
    };

    // Effect to refetch tasks when list changes
    React.useEffect(() => {
        setPage(1);
        setHasMore(true);
        setTasks([]); // Clear tasks while loading new list
        fetchTasks(1, true);
    }, [selectedListId]);
    
    // Initial Load
    React.useEffect(() => {
        fetchUserLists();
    }, []);

    // Removed useFocusEffect in favor of explicit useEffects managed by state changes
    useFocusEffect(
        useCallback(() => {
             // Optional: Refetch if returning to screen. For now, rely on persisted state.
             // If needed, we can re-trigger fetchTasks(page, true) here, but need to be careful with double fetching.
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
                <>
                    <View style={styles.listsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listsContent}>
                            <TouchableOpacity 
                                style={[styles.listChip, selectedListId === 'all' && styles.listChipSelected]}
                                onPress={() => handleListSelect('all')}
                            >
                                <Ionicons name="list" size={16} color={selectedListId === 'all' ? '#fff' : '#666'} />
                                <Text style={[styles.listChipText, selectedListId === 'all' && styles.listChipTextSelected]}>Todos</Text>
                            </TouchableOpacity>

                            {lists.map(list => (
                                <TouchableOpacity 
                                    key={list._id} 
                                    style={[styles.listChip, selectedListId === list._id && styles.listChipSelected]}
                                    onPress={() => handleListSelect(list._id)}
                                >
                                    {/* Can map icons here later */}
                                    <Ionicons name="folder-open-outline" size={16} color={selectedListId === list._id ? '#fff' : '#666'} />
                                    <Text style={[styles.listChipText, selectedListId === list._id && styles.listChipTextSelected]}>{list.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

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
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    listsContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    listsContent: {
        paddingHorizontal: 15,
    },
    listChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    listChipSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#0056b3'
    },
    listChipText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#333',
        fontWeight: '500'
    },
    listChipTextSelected: {
        color: '#fff'
    },
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
