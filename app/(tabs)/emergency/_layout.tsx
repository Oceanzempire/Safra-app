import { Tabs } from "expo-router"
import { AlertTriangle, BookOpen } from "lucide-react-native"
import { colors } from "@/constants/colors"

export default function EmergencyLayout() {
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
          title: "Emergency",
          tabBarIcon: ({ color, size }) => <AlertTriangle size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="guides"
        options={{
          title: "Guides",
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
