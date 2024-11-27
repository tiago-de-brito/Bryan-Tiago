import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  StyleSheet,
  Alert,
} from 'react-native';

import { auth } from '../utils/firebase';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const lastLogin = await AsyncStorage.getItem('lastLogin');
      const isLoggedOut = (await AsyncStorage.getItem('isLoggedOut')) === 'true';

      if (token && lastLogin && !isLoggedOut) {
        const timeDiff = Date.now() - parseInt(lastLogin, 10);
        const maxInactiveTime = 24 * 60 * 60 * 1000;
        if (timeDiff < maxInactiveTime) {
          router.push('./home');
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.setItem('userToken', userCredential.user.uid);
      await AsyncStorage.setItem('lastLogin', Date.now().toString());
      await AsyncStorage.setItem('isLoggedOut', 'false');
      router.push('./home');
    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro ao fazer login. Por favor, tente novamente.';
      
      // Mapear os erros do Firebase para mensagens amigáveis
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'O formato do e-mail é inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta conta está desativada.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado. Verifique o e-mail.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta. Tente novamente.';
          break;
        default:
          console.error('Erro inesperado:', error);
      }
  
      // Exibir o alerta amigável
      Alert.alert('Erro de Login', errorMessage, [{ text: 'OK' }]);
    }
  };
  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/pages/registerUser/RegisterScreen')}>
        <Text style={styles.registerLink}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#393838',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#393838',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    color: '#393838',
    marginTop: 10,
    fontSize: 14,
  },
});

export default LoginScreen;
