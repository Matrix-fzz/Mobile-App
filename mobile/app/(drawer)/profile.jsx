import HeaderS from '@/components/HeaderSimple';
import { ThemeContext } from '@/context/ThemeContext'; 
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react'; 
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '@/context/AuthContext';

export default function Profile() {
  const router = useRouter();
 
  const { theme } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState('Posts');

 const { user } = useContext(AuthContext);
  if (user) {
   
  }
  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    backgroundImage: {
      flex: 1,
      
      contentFit: 'cover',
    },
    profileCard: {
      width: '90%',
      height: '95%',
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.white + '30',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginTop: 20,
    },
    profileImageContainer: {
      width: 110,
      height: 110,
      borderRadius: 55,
      justifyContent: 'center',
      alignItems: 'center',
 
      shadowColor: theme.primary,
      backgroundColor: theme.primary, 
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 15,
      elevation: 10,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: theme.background + '80', 
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.white, 
      marginTop: 15,
    },
    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontSize: 16,
      color: theme.white + '90', 
      marginTop: 5,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      gap: 10,
    },
    editButton: {
      flexDirection: 'row',
      backgroundColor: theme.primary, 
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
    },
    editButtonText: {
      color: theme.white, 
      fontWeight: 'bold',
    },
    settingsButton: {
      flexDirection: 'row',
      backgroundColor: theme.white + '20',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
    },
    settingsButtonText: {
      color: theme.white,
      fontWeight: 'bold',
    },
    divider: {
      height: 1,
      backgroundColor: theme.white + '20', 
      marginVertical: 20,
    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    tab: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.white + '70',
    },
    activeTab: {
      color: theme.white,
    },
    activeTabIndicator: {
      height: 2,
      width: '100%',
      backgroundColor: theme.primary, 
      marginTop: 5,
    },
   
  });

  return (
    <>
      <HeaderS />
      <ImageBackground
        source={require('@/assets/images/back.png')}
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.container}>
          <BlurView intensity={60} tint="dark" style={styles.profileCard}>
            <View style={styles.header}>
              <View style={styles.profileImageContainer}>
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
              </View>
              <View style={styles.usernameContainer}>
              <Text style={styles.name}>{user ? user.name : 'Welcome'}</Text>
              
                <MaterialIcons name="verified" size={18} color={theme.income} style={{ marginLeft: 5 }} />
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => router.push('/settingsScreen/editprofile')}>
              
                <Text style={styles.editButtonText}>Edit Profile</Text>
                <Feather name="edit-2" size={14} color={theme.white} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.settingsButton}>
                <Feather name="settings" size={16} color={theme.white} style={{ marginRight: 5 }} />
                <Text style={styles.settingsButtonText}>Settings</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.divider} />

            <View style={styles.tabsContainer}>
              <TouchableOpacity onPress={() => setActiveTab('Posts')}>
                <Text style={[styles.tab, activeTab === 'Posts' && styles.activeTab]}>Posts</Text>
                {activeTab === 'Posts' && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('Collections')}>
                <Text style={[styles.tab, activeTab === 'Collections' && styles.activeTab]}>Collections</Text>
                {activeTab === 'Collections' && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            </View>

          </BlurView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}