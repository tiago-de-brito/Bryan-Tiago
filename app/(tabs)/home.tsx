import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  BackHandler,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import {
  getAllAnuncios,
  deleteAnuncio,
  auth,
  db,
  getAnunciosWithUserEmails,
} from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export interface Anuncio {
  id: string;
  title: string;
  description: string;
  preco: number;
  fotos: string[];
  userId: string;
  estado: string;
  telefone: string;
  email: string;
}

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [showOwnAnuncios, setShowOwnAnuncios] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchAnuncios = async () => {
    const user = auth.currentUser;
    if (user) {
      const allAnunciosRaw = await getAnunciosWithUserEmails();
      const allAnuncios: Anuncio[] = await Promise.all(
        allAnunciosRaw.map(async (anuncio: Partial<Anuncio>) => {
          const userDoc = await getDoc(doc(db, 'users', anuncio.userId || ''));
          const userData = userDoc.exists() ? userDoc.data() : {};
          return {
            id: anuncio.id || '',
            title: anuncio.title || 'Título não disponível',
            description: anuncio.description || 'Descrição não disponível',
            preco: anuncio.preco || 0,
            fotos: anuncio.fotos || [],
            userId: anuncio.userId || '',
            estado: userData.estado || 'Estado não disponível',
            telefone: userData.telefone || 'Telefone não disponível',
            email: userData.email || 'E-mail não disponível',
          } as Anuncio;
        })
      );

      const userAnuncios = allAnuncios.filter((anuncio) => anuncio.userId === user.uid);
      const otherAnuncios = allAnuncios.filter((anuncio) => anuncio.userId !== user.uid);

      setAnuncios(showOwnAnuncios ? [...userAnuncios, ...otherAnuncios] : otherAnuncios);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAnuncios();

      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [showOwnAnuncios])
  );

  const toggleShowOwnAnuncios = () => {
    setShowOwnAnuncios((prev) => !prev);
  };

  const handleDeleteAnuncio = (anuncioId: string) => {
    Alert.alert('Excluir Anúncio', 'Tem certeza de que deseja excluir este anúncio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteAnuncio(anuncioId);
          fetchAnuncios();
        },
      },
    ]);
  };

  const handleEditAnuncio = (anuncio: Anuncio) => {
    router.push({
      pathname: '/pages/editarAnuncio/EditAnuncio',
      params: { anuncioId: anuncio.id },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Mostrar meus anúncios</Text>
        <TouchableOpacity onPress={toggleShowOwnAnuncios}>
          <Image
            source={
              showOwnAnuncios ? require('../../assets/hide.png') : require('../../assets/show.png')
            }
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : anuncios.length === 0 ? (
        <Text style={styles.emptyText}>Não há anúncios cadastrados.</Text>
      ) : (
        <FlatList
          data={anuncios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.anuncioContainer,
                item.userId === auth.currentUser?.uid && styles.ownAnuncio,
              ]}>
              <Text style={styles.anuncioTitle}>{item.title}</Text>
              <Text style={styles.anuncioEstado}>{item.estado}</Text>
              {item.fotos.length > 0 && (
                <Image source={{ uri: item.fotos[0] }} style={styles.foto} />
              )}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/pages/detalharAnuncio/DetalharAnuncio',
                    params: { anuncioId: item.id },
                  })
                }>
                <Text style={styles.verMaisButton}>Ver mais informações</Text>
              </TouchableOpacity>
              {item.userId === auth.currentUser?.uid && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => handleEditAnuncio(item)}>
                    <Image source={require('../../assets/edit.png')} style={styles.editICon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteAnuncio(item.id)}>
                    <Image source={require('../../assets/trash.png')} style={styles.thrashICon} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1f1f1f', // Fundo da tela cinza chumbo
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleText: {
    color: '#FFF',
    fontSize: 16,
    marginRight: 8,
  },
  toggleIcon: {
    width: 24,
    height: 24,
    tintColor: '#ff4d4d', // Vermelho para o ícone
  },
  thrashICon: {
    width: 40,
    height: 40,
  },
  editICon: {
    width: 40,
    height: 40,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
  },
  emptyText: {
    color: '#FFF',
    fontSize: 16,
  },
  anuncioContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#2e2e2e', // Cinza escuro para os anúncios
    borderColor: '#3e3e3e',
  },
  ownAnuncio: {
    backgroundColor: '#383838', // Cinza mais claro para os próprios anúncios
  },
  anuncioTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  anuncioEstado: {
    color: '#ccc',
    marginBottom: 10,
  },
  foto: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 5,
  },
  verMaisButton: {
    marginTop: 10,
    color: '#ff4d4d', // Texto vermelho para link
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
