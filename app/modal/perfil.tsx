import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Modal() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name?: string;
    estado?: string;
    telefone?: string;
    email: string;
    senha?: string; // Adicionei o campo para simular a senha
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        setUserData({
          email: currentUser.email ?? 'E-mail não disponível',
          senha: 'senhaExemplo123', // Simula uma senha para demonstração
          ...userDoc.data(),
        });
      } else {
        setUserData(null);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const confirmLogout = () => {
    Alert.alert(
      'Confirmação de Logout',
      'Tem certeza de que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.setItem('isLoggedOut', 'true');
      router.replace('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userData ? (
        <View style={styles.card}>
          <Text style={styles.infoText}>Email: {userData.email}</Text>
          <Text style={styles.infoText}>Nome: {userData.name || 'Não informado'}</Text>
          <Text style={styles.infoText}>Estado: {userData.estado || 'Não informado'}</Text>
          <Text style={styles.infoText}>Telefone: {userData.telefone || 'Não informado'}</Text>
          
        </View>
      ) : (
        <Text style={styles.infoText}>Nenhum usuário autenticado</Text>
      )}

      <View style={styles.logoutButtonContainer}>
        <Button title="Sair" onPress={confirmLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'stretch',
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 15
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },

  toggleText: {
    color: '#007bff',
    fontSize: 16,
  },
  logoutButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
