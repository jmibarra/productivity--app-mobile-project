import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createTask } from '../services/api';

const CreateTaskScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(3); // Default to Low (3)
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Title is required');
            return;
        }

        setLoading(true);
        try {
            await createTask({
                title,
                description,
                priority,
                completed: false,
                list: 'default' // Assuming a default list or backend handles it
            });
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to create task');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const PriorityOption = ({ value, label, icon, color }) => (
        <TouchableOpacity 
            style={[styles.priorityOption, priority === value && styles.prioritySelected]} 
            onPress={() => setPriority(value)}
        >
            <Ionicons name={icon} size={24} color={priority === value ? '#fff' : color} />
            <Text style={[styles.priorityLabel, priority === value && { color: '#fff' }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Task</Text>
                <TouchableOpacity onPress={handleCreate} disabled={loading} style={styles.createButton}>
                     {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createText}>Create</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Title</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="What needs to be done?" 
                    value={title}
                    onChangeText={setTitle}
                    autoFocus
                />

                <Text style={styles.label}>Description</Text>
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Add details..." 
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                />

                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityContainer}>
                    <PriorityOption value={1} label="High" icon="alert-circle" color="#FF3B30" />
                    <PriorityOption value={2} label="Med" icon="arrow-down-circle" color="#FF9500" />
                    <PriorityOption value={3} label="Low" icon="snow" color="#007AFF" />
                    <PriorityOption value={4} label="None" icon="help-circle" color="#8E8E93" />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    backButton: { padding: 5 },
    backText: { color: '#007AFF', fontSize: 16 },
    title: { fontSize: 18, fontWeight: 'bold' },
    createButton: { 
        backgroundColor: '#007AFF', 
        paddingHorizontal: 15, 
        paddingVertical: 6, 
        borderRadius: 15 
    },
    createText: { color: '#fff', fontWeight: 'bold' },
    form: { padding: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 15, fontWeight: '600' },
    input: { 
        fontSize: 16, 
        padding: 12, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 10,
        color: '#333'
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    priorityContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    priorityOption: { 
        flex: 1, 
        alignItems: 'center', 
        padding: 10, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#eee',
        backgroundColor: '#f9f9f9'
    },
    prioritySelected: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
    priorityLabel: { marginTop: 5, fontSize: 12, color: '#333' },
});

export default CreateTaskScreen;
