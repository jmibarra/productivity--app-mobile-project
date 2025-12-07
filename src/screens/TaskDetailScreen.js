import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TaskDetailScreen = ({ route }) => {
    const { task } = route.params;

    const getPriorityDetails = (priority) => {
        switch (priority) {
            case 1: return { icon: 'alert-circle', color: '#FF3B30', label: 'Alta' };
            case 2: return { icon: 'arrow-down-circle', color: '#FF9500', label: 'Media' };
            case 3: return { icon: 'snow', color: '#007AFF', label: 'Baja' };
            default: return { icon: 'help-circle', color: '#8E8E93', label: 'Ninguna' };
        }
    };

    const { icon, color, label } = getPriorityDetails(task.priority);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{task.title}</Text>
                    {task.completed && (
                        <View style={styles.completedBadge}>
                            <Text style={styles.completedText}>Completed</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.text}>{task.description || 'No description provided.'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Priority</Text>
                    <View style={styles.priorityRow}>
                        <Ionicons name={icon} size={24} color={color} />
                        <Text style={[styles.priorityText, { color }]}>{label}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Details</Text>
                    
                    {/* List */}

                    <View style={styles.detailRow}>
                        <Ionicons name="list" size={20} color="#666" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{task.list || 'Default'}</Text>
                    </View>

                    {/* Due Date */}
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={20} color="#666" style={styles.detailIcon} />
                        <Text style={styles.detailText}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </Text>
                    </View>

                    {/* Labels */}
                    <View style={styles.labelsContainer}>
                        {task.labels && task.labels.length > 0 ? (
                            task.labels.map((label, index) => (
                                <View key={index} style={styles.labelChip}>
                                    <Text style={styles.labelText}>{label}</Text>
                                </View>
                            ))
                        ) : (
                             <Text style={styles.noDataText}>No labels</Text>
                        )}
                   </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    completedBadge: { 
        alignSelf: 'flex-start', 
        backgroundColor: '#E5F9E7', 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#4CD964'
    },
    completedText: { color: '#4CD964', fontWeight: 'bold', fontSize: 12 },
    section: { marginBottom: 25 },
    label: { fontSize: 14, color: '#999', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
    text: { fontSize: 16, color: '#333', lineHeight: 24 },
    priorityRow: { flexDirection: 'row', alignItems: 'center' },
    priorityText: { fontSize: 18, fontWeight: '500', marginLeft: 10 },
    
    // New Styles
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    detailIcon: { marginRight: 12, width: 22, textAlign: 'center' },
    detailText: { fontSize: 16, color: '#333' },
    labelsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
    labelChip: { 
        backgroundColor: '#f0f0f0', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e5e5e5'
    },
    labelText: { fontSize: 13, color: '#555' },
    noDataText: { fontSize: 15, color: '#999', fontStyle: 'italic', marginLeft: 4 }
});

export default TaskDetailScreen;
