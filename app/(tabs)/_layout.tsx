import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.faint,
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 7,
          borderTopColor: Colors.border
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <Ionicons name="map-outline" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={20} color={color} />
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={20} color={color} />
        }}
      />
    </Tabs>
  );
}
