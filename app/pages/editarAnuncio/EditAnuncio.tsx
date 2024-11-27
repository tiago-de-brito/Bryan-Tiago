import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { updateAnuncio, getAnuncio } from '../../../utils/firebase';

interface Anuncio {
  title: string;
  description: string;
  preco: number;
  fotos: string[];
  endereco: string;
  telefone: string;
  email: string;
}

const EditAnuncioScreen: React.FC = () => {
  const router = useRouter();
  const { anuncioId } = useGlobalSearchParams();

  const [anuncio, setAnuncio] = useState<Anuncio>({
    title: '',
    description: '',
    preco: 0,
    fotos: [],
    endereco: '',
    telefone: '',
    email: '',
  });

  useEffect(() => {
    const loadAnuncioData = async () => {
      if (anuncioId) {
        const data = await getAnuncio(anuncioId as string);
        if (data) setAnuncio(data as Anuncio);
      }
    };
    loadAnuncioData();
  }, [anuncioId]);

  const handleSave = async () => {
    try {
      await updateAnuncio(anuncioId as string, anuncio);
      Alert.alert('Sucesso', 'Anúncio atualizado com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao salvar o anúncio:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o anúncio.');
    }
  };

  const handleSelecionarFotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedFotos = result.assets?.map((asset) => asset.uri) || [];
      setAnuncio((prevAnuncio) => ({
        ...prevAnuncio,
        fotos: [...prevAnuncio.fotos, ...selectedFotos].slice(0, 5),
      }));
    }
  };

  const handleRemoveFoto = (index: number) => {
    setAnuncio((prevAnuncio) => ({
      ...prevAnuncio,
      fotos: prevAnuncio.fotos.filter((_, i) => i !== index),
    }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={anuncio.title}
          onChangeText={(text) => setAnuncio({ ...anuncio, title: text })}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descrição"
          value={anuncio.description}
          onChangeText={(text) => setAnuncio({ ...anuncio, description: text })}
          multiline
        />

        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          placeholder="Preço"
          value={anuncio.preco.toString()}
          onChangeText={(text) => setAnuncio({ ...anuncio, preco: parseFloat(text) || 0 })}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.photoButton} onPress={handleSelecionarFotos}>
          <Text style={styles.photoButtonText}>Selecionar Fotos</Text>
        </TouchableOpacity>

        <View style={styles.fotosContainer}>
          {anuncio.fotos.map((foto, index) => (
            <View key={index} style={styles.fotoWrapper}>
              <Image source={{ uri: foto }} style={styles.foto} />
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFoto(index)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.fixedButtons}>
        <TouchableOpacity style={[styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fotosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  fotoWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fixedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,

  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditAnuncioScreen;
