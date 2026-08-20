// 1. تعديل الـ Imports
import React, { useContext } from 'react'; // زدنا useContext
import { View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '@/context/ThemeContext'; // جبنا الكونتكست

// حيدنا هاد الـ import، ما بقيناش محتاجينو
// import { COLORS } from "@/constants/colors.js";

const HeaderSh = ({ searchValue, onSearchChange }) => {
    // 2. استعمال useContext باش نجيبو الثيم الحالي
    const { theme } = useContext(ThemeContext);
    
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    // 3. دخلنا الستايلات لداخل باش تقدر تستخدم المتغير 'theme'
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.background, // <--- تبدل اللون
            paddingBottom: 10,
            paddingHorizontal: 15,
            gap: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        backButton: {
            padding: 5,
        },
        barse: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end'
        },
        iconbtnone: {
            fontSize: 26,
            color: theme.primary, // <--- تبدل اللون
            marginRight: 10,
        },
        searchbar: {
            flex: 1,
            backgroundColor: theme.card, // <--- تبدل اللون
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
            paddingHorizontal: 10,
        },
        input: {
            flex: 1,
            color: theme.text, // <--- تبدل اللون
            fontSize: 16,
            paddingVertical: 10,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={28} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.barse}>
                <View style={styles.searchbar}>
                    <TextInput
                        placeholderTextColor={theme.textLight} // <--- تبدل اللون
                        placeholder="Search ..."
                        value={searchValue}
                        onChangeText={onSearchChange}
                        style={styles.input}
                    />
                    <Ionicons name="search-outline" style={styles.iconbtnone} />
                </View>
            </View>
        </View>
    );
};

export default HeaderSh;