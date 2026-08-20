import { useContext, useState,React, Fragment } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, ScrollView,
  TouchableOpacity, Alert, Share, Linking
} from 'react-native';
import HeaderSh from '@/components/HeaderSearch';
import { ThemeContext } from '@/context/ThemeContext';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

const SettingsScreen = () => {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const [isLanguageMenuOpen, setLanguageMenuOpen] = useState(false);
  
  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!isLanguageMenuOpen); // Kat9leb l'valeur
  };
  // --- دوال للأكشنز (Actions) ---
  const handleRateApp = async () => {
    // بدّل هاد الروابط بالروابط الحقيقية ديال التطبيق ديالك
    const storeUrl = 'market://details?id=com.yourappname'; // Play Store
    // const storeUrl = 'itms-apps://itunes.apple.com/app/your-app-id'; // App Store
    try {
      const supported = await Linking.canOpenURL(storeUrl);
      if (supported) {
        await Linking.openURL(storeUrl);
      } else {
        Alert.alert("Error", "Could not open the app store.");
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out NESTIFY, the best app for finding properties! [Your App Link Here]',
        // url: 'https://yourapplink.com' // (اختياري)
      });
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            console.log("User logging out...");
            // هنا كدير لوجيك الخروج الحقيقي (مسح التوكن، إلخ)
            router.replace('/'); // مثال: كترجع لصفحة تسجيل الدخول
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is irreversible. Are you sure you want to permanently delete your account and all associated data?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Deleting account...");
            // هنا كدير لوجيك الحذف الحقيقي (طلب للسيرفر)
          }
        }
      ]
    );
  };

  // --- قائمة الإعدادات الكاملة ---
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'lock-closed-outline', name: 'Change Password', route: '/settingsScreen/Changepassword', iconLib: 'Ionicons' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications-outline', name: 'Notifications', route: '/notifications', iconLib: 'Ionicons' },
       { icon: 'language-outline', name: 'Language', action: toggleLanguageMenu, iconLib: 'Ionicons' },
        ],
    },
    {
      title: 'Support & Feedback',
      items: [
        { icon: 'help-circle-outline', name: 'Help Center', route: '/help', iconLib: 'Ionicons' },
        { icon: 'information-circle-outline', name: 'About App', route: '/about', iconLib: 'Ionicons' },
        { icon: 'star-outline', name: 'Rate the App', action: handleRateApp, iconLib: 'Ionicons' },
        { icon: 'share-social-outline', name: 'Share App', action: handleShareApp, iconLib: 'Ionicons' },
      ],
    },
  ];

  const renderIcon = (lib, name, color, size) => {
    switch (lib) {
      case 'Ionicons': return <Ionicons name={name} size={size} color={color} />;
      case 'MaterialIcons': return <MaterialIcons name={name} size={size} color={color} />;
      default: return <Feather name={name} size={size} color={color} />;
    }
  };

  // ✨ تعديل StyleSheet
  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { paddingBottom: 40 },

    sectionHeader: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.textLight,
      marginTop: 20,
      marginBottom: 10,
      paddingHorizontal: 20,
      textTransform: 'uppercase',
    },

    card: {
      backgroundColor: theme.card,
      borderRadius: 15,
      marginHorizontal: 15,
      overflow: 'hidden',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },

    // كل item
    settingItem: {
      flexDirection: 'row',       // عناصر بجنب بعض
      alignItems: 'center',       // وسط عمودياً
      paddingVertical: 20,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },

    // الأيقونة
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
      marginRight: 15,
    },

    // النص + السهم
    chevronContainer: {
      flex: 1,                        // ياخذ المساحة الكاملة
      flexDirection: 'row',           // النص و السهم بجنب بعض
      justifyContent: 'space-between',// النص يبقى يسار و السهم يمين
      alignItems: 'center',
    },

    settingText: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
    },
     languageDropdown: {
      backgroundColor: theme.card, // Bach yakhod nafs loun
      paddingHorizontal: 15,
    },
    languageOption: {
      paddingVertical: 15,
      borderTopWidth: 1, // Kndiro separtor fo9 kol item
      borderTopColor: theme.border,
    },
    languageOptionText: {
      fontSize: 16,
      color: theme.text,
      textAlign: 'center'
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderSh />
      <ScrollView contentContainerStyle={styles.container}>
        {settingsSections.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => {
                const content = (
                  <TouchableOpacity style={styles.settingItem} onPress={item.action}>
                    <View style={styles.iconContainer}>
                      {renderIcon(item.iconLib, item.icon, theme.text, 22)}
                    </View>

                    <View style={styles.chevronContainer}>
                      <Text style={styles.settingText}>{item.name}</Text>
                      <Feather name="chevron-right" size={20} color={theme.textLight} />
                    </View>
                  </TouchableOpacity>
                );

               return (
        <Fragment key={item.name}>
    {/* Hada l'code li kan 3ndek 9bil, ghir b chwiya tghyir bach n'controliw l'chevron w l'action */}
    {item.route ? (
      <Link href={item.route} asChild>{content}</Link>
    ) : (
      // Hna kansta3mlo l'content l'originali li fih TouchableOpacity
      <TouchableOpacity style={styles.settingItem} onPress={item.action}>
        <View style={styles.iconContainer}>
          {renderIcon(item.iconLib, item.icon, theme.text, 22)}
        </View>
        <View style={styles.chevronContainer}>
          <Text style={styles.settingText}>{item.name}</Text>
          {/* ---> TBEDIL HNA: Kanbedlo l'icon 3la 7sab l'état */}
          {item.name === 'Language' ? (
            <Feather name={isLanguageMenuOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.textLight} />
          ) : (
            <Feather name="chevron-right" size={20} color={theme.textLight} />
          )}
        </View>
      </TouchableOpacity>
    )}

    {/* ---> L'CODE L'JADID L'MOHIM HOWA HADA <--- */}
    {/* Shart: Affichi had l'block FA9AT ila kan l'item howa "Language" W l'menu mhloul */}
    {item.name === 'Language' && isLanguageMenuOpen && (
      <View style={styles.languageDropdown}>
        <TouchableOpacity style={styles.languageOption} onPress={() => console.log('English Selected')}>
          <Text style={styles.languageOptionText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageOption} onPress={() => console.log('العربية Selected')}>
          <Text style={styles.languageOptionText}>العربية</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.languageOption} onPress={() => console.log('Français Selected')}>
          <Text style={styles.languageOptionText}>Français</Text>
        </TouchableOpacity>
      </View>
    )}
        </Fragment>
);
              })}
            </View>
          </View>
        ))}

        <Text style={styles.sectionHeader}>Actions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '1A' }]}>
              <MaterialIcons name="logout" size={22} color={theme.primary} />
            </View>
            <Text style={styles.settingText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.expense + '1A' }]}>
              <Feather name="trash-2" size={22} color={theme.expense} />
            </View>
            <Text style={[styles.settingText, { color: theme.expense }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;