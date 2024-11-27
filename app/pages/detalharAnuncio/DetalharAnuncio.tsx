import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { getAnuncio } from '../../../utils/firebase';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

const estadosMap: { [key: string]: string } = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins'
};

const AnuncioDetailsScreen: React.FC = () => {
  const { anuncioId } = useGlobalSearchParams();
  const [anuncio, setAnuncio] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipeThreshold = 50;

  useEffect(() => {
    const fetchAnuncio = async () => {
      if (anuncioId) {
        try {
          const data = await getAnuncio(anuncioId as string);
          setAnuncio(data);
        } catch (error) {
          console.error("Erro ao buscar o anúncio:", error);
        }
      }
    };
    fetchAnuncio();
  }, [anuncioId]);

  const goToNextImage = () => {
    if (anuncio && currentIndex < anuncio.fotos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onSwipe = (event: PanGestureHandlerGestureEvent) => {
    const { translationX, state } = event.nativeEvent;
    if (state === State.END) {
      if (translationX < -swipeThreshold) {
        goToNextImage();
      } else if (translationX > swipeThreshold) {
        goToPreviousImage();
      }
    }
  };

  if (!anuncio) return <Text>Carregando...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{anuncio.title}</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>Descrição: {anuncio.description}</Text>
        <Text style={styles.infoText}>Preço: R$ {anuncio.preco.toFixed(2)}</Text>
        {anuncio.estado && (
          <Text style={styles.infoText}>
            Estado: {estadosMap[anuncio.estado] ? estadosMap[anuncio.estado] : anuncio.estado}
          </Text>
        )}
        {anuncio.telefone && <Text style={styles.infoText}>Telefone: {anuncio.telefone}</Text>}
        {anuncio.email && <Text style={styles.infoText}>E-mail: {anuncio.email}</Text>}
      </View>

      <GestureHandlerRootView style={styles.carouselContainer}>
        <PanGestureHandler onHandlerStateChange={onSwipe}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: anuncio.fotos[currentIndex] }}
              style={styles.carouselImage}
              resizeMode="contain"
            />
            <Text style={styles.imageIndex}>{currentIndex + 1}/{anuncio.fotos.length}</Text>
          </View>
        </PanGestureHandler>

        <View style={styles.navigationButtons}>
          <TouchableOpacity onPress={goToPreviousImage} disabled={currentIndex === 0}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextImage} disabled={currentIndex === anuncio.fotos.length - 1}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4d4d',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  carouselContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  carouselImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  imageIndex: {
    color: '#fff',
    marginTop: 10,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  navButtonText: {
    color: '#ff4d4d',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default AnuncioDetailsScreen;
