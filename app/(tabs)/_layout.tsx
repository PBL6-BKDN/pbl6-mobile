import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ViewStyle } from "react-native";

export const tabBarStyle: ViewStyle = {
  backgroundColor: "#FFFFFF",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
  elevation: 5,
  height: 78,
  paddingBottom: 40,
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0c4a6e",
        tabBarStyle: tabBarStyle,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="HomeScreen" // ⚠️ phải khớp với file HomeScreen.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home2"
        options={{
          title: "Home 2",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="DeviceCodeScreen" // ⚠️ phải khớp với file DeviceCodeScreen.tsx
        options={{
          title: "Device",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "qr-code" : "qr-code-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
