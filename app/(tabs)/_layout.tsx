import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/store/settings-store';
import { colors } from '@/constants/colors';
import {
  Home,
  FileText,
  CheckSquare,
  Settings,
  AlertTriangle,
} from 'lucide-react-native';
import { useTranslation } from '@/hooks/use-translation';

export default function TabLayout() {
  const { theme } = useSettingsStore();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  // Determine which theme to use
  const activeTheme = theme === 'system' ? colorScheme || 'light' : theme;

  const isDarkMode = activeTheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDarkMode
          ? colors.darkTextSecondary
          : colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDarkMode
            ? colors.darkBackground
            : colors.background,
          borderTopColor: isDarkMode ? colors.darkBorder : colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Home'),
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: t('Notes'),
          tabBarIcon: ({ color, size }) => <FileText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: t('Tasks'),
          tabBarIcon: ({ color, size }) => (
            <CheckSquare size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="emergency"
        options={{
          title: t('Emergency'),
          tabBarIcon: ({ color, size }) => (
            <AlertTriangle size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('Settings'),
          tabBarIcon: ({ color, size }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
