import { Tabs } from 'expo-router';
import { Droplets, Bell , Siren , } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function RemindersLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reminders',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="water"
        options={{
          title: 'Water',
          tabBarIcon: ({ color, size }) => (
            <Droplets size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medication"
        options={{
          title: 'Medications',
          tabBarIcon: ({ color, size }) => <Siren  size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
