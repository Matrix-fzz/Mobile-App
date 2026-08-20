
import { useContext } from 'react';
import { Drawer } from "expo-router/drawer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { ThemeContext } from '@/context/ThemeContext'; 
import { AuthContext } from '@/context/AuthContext';

// --- المكون الأول: CustomDrawerContent ---
function CustomDrawerContent(props) {
  const { theme } = useContext(ThemeContext);

  // ==> 1. KANJIBO L'USER O LA FONCTION signOut MEN SNDOQ DYALNA <==
  const { user, signOut } = useContext(AuthContext);
  if (user) {
   
  }
  const styles = StyleSheet.create({
    drawerHeader: {
      padding: 25,
      backgroundColor: theme.primary,
      alignItems: 'center',
      marginBottom: 10,
      marginTop: -25,
    },
    profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: theme.background,
      marginBottom: 10,
    },
    userName: {
      color: theme.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    userEmail: {
      color: theme.white + '80',
      fontSize: 14,
    },
    drawerFooter: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.gray + '50',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerText: {
      fontSize: 12,
      color: theme.text,
      marginBottom: 5,
    },
    footerLink: {
      fontSize: 12,
      color: theme.primary,
      textDecorationLine: 'underline',
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}> 
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image
    source={
      // L'LOGIC L'JDID KAYBDA HNA
      user && user.profile_photo
        ? { uri: user.profile_photo } // Ila l'user 3endo tswira, affichiha men l'URL
        : require('@/assets/images/default.jpg') // Ila la, affichi tswira par défaut
      // L'LOGIC KAYTSALA HNA
    }
    style={styles.profileImage}
  />
          {/* ==> 2. KAN'AFFICHIW L'INFORMATION L7A9I9IYA DYAL L'USER <== */}
          {/* Kandiro chert bach l'app matplantach ila l'user kan ba9i makaynch */}
          <Text style={styles.userName}>{user ? user.name : 'Welcome'}</Text>
          <Text style={styles.userEmail}>{user ? user.email : 'Please sign in'}</Text>
        </View>

        <DrawerItemList {...props} />

        {/* ==> 3. KANRBTO L BOUTON B LA FONCTION signOut DYALNA <== */}
        <DrawerItem
          label="Log Out"
          onPress={signOut} // Bdlna console.log b la fonction signOut l7a9i9iya
          icon={({ color, size }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          )}
          inactiveTintColor={theme.text}
          labelStyle={{ fontWeight: 'bold' }}
        />
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <TouchableOpacity onPress={() => console.log('Privacy Policy')}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// L COMPONENT L TE7TANI KAYB9A KIMA HOWA, MATBEDDEL FIH WALO
export default function DrawerLayout() {
  // 2. استعمال useContext هنا أيضا
  const { theme } = useContext(ThemeContext);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // 4. تحديث جميع الألوان في screenOptions
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.text,
        drawerActiveBackgroundColor: theme.primary + '10',
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 3,
        },
        drawerStyle: {
          backgroundColor: theme.background, // مهم جداً
          width: '80%',
        },
      }}
    >
      {/* Drawer Screens كتبقى كيفما هي */}
      <Drawer.Screen name="(tabs)" options={{ title: "Home", drawerIcon: ({ color, size }) => (<Ionicons name="home-outline" size={size} color={color} />), }} />
      <Drawer.Screen name="profile" options={{ title: "Profile", drawerIcon: ({ color, size }) => (<Ionicons name="person-circle-outline" size={size} color={color} />), }} />
      <Drawer.Screen name="verification" options={{ title: "Verification", drawerIcon: ({ color, size }) => (<MaterialIcons name="verified-user" size={size} color={color} />), }} />
      <Drawer.Screen name="authenticator" options={{ title: "Authenticator", drawerIcon: ({ color, size }) => (<Ionicons name="key-outline" size={size} color={color} />), }} />
      <Drawer.Screen name="settings" options={{ title: "Settings", drawerIcon: ({ color, size }) => (<Ionicons name="settings-outline" size={size} color={color} />), }} />
      <Drawer.Screen name="theme" options={{ title: "Theme", drawerIcon: ({ color, size }) => (<Ionicons name="color-palette-outline" size={size} color={color} />), }} />
      <Drawer.Screen name="about" options={{ title: "About App", drawerIcon: ({ color, size }) => (<Ionicons name="information-circle-outline" size={size} color={color} />), }} />
      <Drawer.Screen name="help" options={{ title: "Help", drawerIcon: ({ color, size }) => (<Ionicons name="help-circle-outline" size={size} color={color} />), }} />
    </Drawer>
  );
}