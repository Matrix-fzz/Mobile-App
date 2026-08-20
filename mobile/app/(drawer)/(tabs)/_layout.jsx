import React, { useContext } from 'react';
// import { Redirect } from 'expo-router'; // ==> 1. KAN7YDO REDIRECT
import { Tabs } from 'expo-router';
// import { useAuth } from '@clerk/clerk-expo'; // ==> 2. KAN7YDO USEAUTH
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ThemeContext } from '@/context/ThemeContext';

const TabsLayout = () => {
  const { theme } = useContext(ThemeContext);
 
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textLight,
  
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600"
        },
        headerStyle: {
          backgroundColor: theme.background,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
        },
      }}
    >
      <Tabs.Screen 
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="adding"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => <MaterialIcons name='add-home' size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="map-marked-alt" size={size} color={color} />,
        }}
      />
      <Tabs.Screen 
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="inbox-full" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabsLayout;