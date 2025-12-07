import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getNotes } from '../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotesScreen = ({ navigation }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const data = await getNotes();
            setNotes(data.notes || []);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const renderNote = ({ item }) => {
        return (
            <View style={[styles.noteCard, { backgroundColor: item.color || '#FFF9C4' }]}>
                <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.noteContent} numberOfLines={6}>{item.content}</Text>
                
                {/* Date footer */}
                <Text style={styles.noteDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>My Notes</Text>
            </View>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={notes}
                    renderItem={renderNote}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No notes yet.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' }, // White background for clean look
    header: { padding: 20, paddingTop: 10, paddingBottom: 15 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingHorizontal: 15, paddingBottom: 20 },
    columnWrapper: { justifyContent: 'space-between' },
    
    // Note Card Styles
    noteCard: {
        width: '48%', // Approx half with spacing
        aspectRatio: 1, // Square shape
        padding: 15,
        marginBottom: 15,
        borderRadius: 2, // Slight rounded corners for randomness feel, or 0 for sharp post-it
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333'
    },
    noteContent: {
        fontSize: 14,
        color: '#444',
        flex: 1, // Fill available space
        lineHeight: 20
    },
    noteDate: {
        fontSize: 10,
        color: 'rgba(0,0,0,0.5)',
        alignSelf: 'flex-end',
        marginTop: 5
    },
    emptyContainer: {
        alignItems: 'center', 
        marginTop: 50
    },
    emptyText: {
        color: '#999',
        fontSize: 16
    }
});

export default NotesScreen;
