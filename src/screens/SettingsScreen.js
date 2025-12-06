import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
    const { logout, userInfo } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Configuracion</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.userInfo}>Logged in as: {userInfo?.email}</Text>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    content: { padding: 20, alignItems: 'center' },
    userInfo: { fontSize: 16, marginBottom: 20 },
    logoutButton: {
        backgroundColor: '#ff3b30',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SettingsScreen;
