import { ThemeContext } from '@/context/ThemeContext'; // جبنا الكونتكست
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Link } from 'expo-router';
import { useContext } from 'react'; // زدنا useContext
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// حيدنا هاد الـ import، ما بقيناش محتاجينو
// import { COLORS } from "@/constants/colors.js";

const Header = () => {
    // 2. استعمال useContext باش نجيبو الثيم الحالي
    const { theme } = useContext(ThemeContext);

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

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
            borderBottomWidth: 1, // زدت بوردر خفيف لتحت
            borderBottomColor: theme.border,
        },
        logoimg: {
            contentFit: 'cover',
            width: 50,
            height: 40,
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
            flex: 1,
            textAlign: 'right',
            marginRight: 5,
        },
        searchbar: {
            flex: 1,
            backgroundColor: theme.card, // <--- تبدل اللون
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 8,
            paddingHorizontal: 10, // زدت شوية padding
            alignItems: 'center',
            marginRight: 8,
        },
        input: {
            flex: 1,
            color: theme.textLight, // <--- بدلت اللون لـ textLight باش يبان بحال placeholder
            fontSize: 16,
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Image source={require('@/assets/images/logonestify.png')} style={styles.logoimg} />
            <View style={styles.barse}>
                <Link href='/search' asChild>
                    <TouchableOpacity style={styles.searchbar}>
                        <Text style={styles.input}>Search...</Text>
                        <Ionicons name="search-outline" style={styles.iconbtnone} />
                    </TouchableOpacity>
                </Link>
                <Pressable
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    style={{ marginLeft: 8 }} // بدلتها لـ marginLeft باش تعطي مسافة
                >
                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={28} // كبرت الأيقونة شوية
                        color={theme.text} // <--- تبدل اللون
                    />
                </Pressable>
            </View>
        </View>
    );
}

export default Header;