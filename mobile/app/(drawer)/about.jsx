// 1. تعديل الـ Imports
import React, { useContext } from 'react'; // زدنا useContext
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import HeaderS from '@/components/HeaderSimple';
import { ThemeContext } from '@/context/ThemeContext'; // جبنا الكونتكست
import { Feather } from '@expo/vector-icons';

const AboutScreen = () => {
  // 2. استعمال useContext باش نجيبو الثيم الحالي
  const { theme } = useContext(ThemeContext);

  const appVersion = "1.0.0"; // يمكنك تجيب هادي من package.json

  // 3. دخلنا الستايلات لداخل باش تقدر تستخدم المتغير 'theme'
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flexGrow: 1,
      padding: 20,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logo: {
      
      width: 150,
      height: 120,
      marginBottom: 15,
      
    },
 
    versionText: {
      fontSize: 16,
      color: theme.textLight,
      marginTop: 5,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 15,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    cardText: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 24,
    },
    linkItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    linkText: {
      fontSize: 17,
      color: theme.text,
      fontWeight: '600',
    },
    footer: {
      textAlign: 'center',
      color: theme.textLight,
      marginTop: 20,
    }
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderS />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          {/* هنا غادي تحط اللوغو ديالك. حاليا درت placeholder */}
          <Image
            source={require('@/assets/images/logonestify.png')} // بدّل هاد المسار
            style={styles.logo}
          />
         
          <Text style={styles.versionText}>Version {appVersion}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardText}>
            Our mission at NESTIFY is to simplify the process of buying and renting properties, making it a secure, transparent, and enjoyable experience for everyone.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Useful Links</Text>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://example.com/privacy')}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Feather name="chevron-right" size={24} color={theme.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://example.com/terms')}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Feather name="chevron-right" size={24} color={theme.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkItem, { borderBottomWidth: 0 }]} onPress={() => Linking.openURL('https://example.com/contact')}>
            <Text style={styles.linkText}>Contact Us</Text>
            <Feather name="chevron-right" size={24} color={theme.textLight} />
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2025 NESTIFY By MATRIX. All Rights Reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;