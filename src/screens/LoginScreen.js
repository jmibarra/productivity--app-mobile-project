import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useContext(AuthContext);

    const handleLogin = async () => {
         if (!email || !password) {
             Alert.alert('Error', 'Please fill in all fields');
             return;
         }
         
         try {
             await login(email, password);
         } catch (e) {
             Alert.alert('Login Failed', 'Invalid credentials');
         }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput 
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
