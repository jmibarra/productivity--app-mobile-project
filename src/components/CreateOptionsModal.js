import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CreateOptionsModal = ({ visible, onClose, onSelect }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.optionsContainer}>
                            <Text style={styles.title}>Create New</Text>
                            
                            <View style={styles.row}>
                                <TouchableOpacity style={styles.option} onPress={() => onSelect('Task')}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#007AFF' }]}>
                                        <Ionicons name="checkbox" size={30} color="#fff" />
                                    </View>
                                    <Text style={styles.optionLabel}>Task</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.option} onPress={() => onSelect('Note')}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#FF9500' }]}>
                                        <Ionicons name="document-text" size={30} color="#fff" />
                                    </View>
                                    <Text style={styles.optionLabel}>Note</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.option} onPress={() => onSelect('Habit')}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#34C759' }]}>
                                        <Ionicons name="refresh" size={30} color="#fff" />
                                    </View>
                                    <Text style={styles.optionLabel}>Habit</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    optionsContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        paddingBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    option: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
    },
});

export default CreateOptionsModal;
