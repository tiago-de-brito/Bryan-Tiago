import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import * as ImagePicker from 'expo-image-picker';

const CadastrarAnuncioScreen: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [preco, setPreco] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);

  const handleCadastrarAnuncio = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }
      await addDoc(collection(db, 'anuncio'), {
        title,
        description,
        preco: parseFloat(preco),
        fotos,
        userId: auth.currentUser.uid,
      });
      Alert.alert('Sucesso', 'Anúncio cadastrado com sucesso!');
      router.push('/home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o anúncio.');
    }
  };

  const handleSelecionarFotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true });
    if (!result.canceled) {
      const selectedFotos = result.assets?.map((asset) => asset.uri) || [];
      setFotos((prevFotos) => [...prevFotos, ...selectedFotos].slice(0, 5));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Preço"
          value={preco}
          onChangeText={setPreco}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.photoButton} onPress={handleSelecionarFotos}>
          <Text style={styles.photoButtonText}>Selecionar Fotos</Text>
        </TouchableOpacity>

        <View style={styles.fotosContainer}>
          {fotos.map((foto, index) => (
            <View key={index} style={styles.fotoWrapper}>
              <Image source={{ uri: foto }} style={styles.foto} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setFotos(fotos.filter((_, i) => i !== index))}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.cadastrarButton} onPress={handleCadastrarAnuncio}>
          <Text style={styles.cadastrarButtonText}>Publicar Anúncio</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#393838',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  photoButton: {
    backgroundColor: '#393838',
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  photoButtonText: {
    color: '#f2f2f2',
    fontWeight: 'bold',
  },
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  fotoWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#d92525',
    borderRadius: 12,
    padding: 5,
  },
  removeButtonText: {
    color: '#f2f2f2',
    fontWeight: 'bold',
  },
  bottomButtonContainer: {
    padding: 15,
    backgroundColor: '#f2f2f2',
  },
  cadastrarButton: {
    backgroundColor: '#d92525',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  cadastrarButtonText: {
    color: '#f2f2f2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CadastrarAnuncioScreen;
