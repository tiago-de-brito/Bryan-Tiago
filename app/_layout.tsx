import '../global.css';

import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal/perfil" options={{ presentation: 'modal', title: 'Meu Perfil' }} />
      <Stack.Screen
        name="pages/editarAnuncio/EditAnuncio"
        options={{
          title: 'Editar Anúncio', // Define o título da tela
          headerBackVisible: false, // Oculta o botão "Voltar"
        }}
      />
      <Stack.Screen
        name="index" // Nome da tela inicial de login
        options={{
          title: 'Login', // Define o título da tela como "Login"
          headerBackVisible: false, // Oculta o botão "Voltar" para evitar navegação para trás
        }}
      />
      <Stack.Screen
        name="pages/registerUser/RegisterScreen" // Nome da tela inicial de login
        options={{
          title: 'Cadastro', // Define o título da tela como "Login"
          headerBackVisible: false, // Oculta o botão "Voltar" para evitar navegação para trás
        }}
      />
      <Stack.Screen
        name="pages/detalharAnuncio/DetalharAnuncio" // Nome da tela inicial de login
        options={{
          title: 'Informações do anúncio', // Define o título da tela como "Login"
          headerBackVisible: false, // Oculta o botão "Voltar" para evitar navegação para trás
        }}
      />
      
    </Stack>
  );
}
