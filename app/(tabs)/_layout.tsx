import { Link, Tabs } from 'expo-router';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF', // Cor clara para ícone ativo
        tabBarInactiveTintColor: '#CCCCCC', // Cor mais clara para ícone inativo
        tabBarStyle: {
          backgroundColor: '#121212', // Fundo escuro para a barra de guias
          borderTopWidth: 0,
          paddingBottom: 4,
          paddingTop: 3
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Anúncios',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="./modal/perfil" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="cadastrarAnuncio"
        options={{
          title: 'Anunciar Carro',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
    </Tabs>
  );
}
