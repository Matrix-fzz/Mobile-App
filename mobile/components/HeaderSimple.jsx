import React, { useContext } from 'react'; 
import { View,  TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '@/context/ThemeContext'; 
const HeaderS = () => {
  
    const { theme } = useContext(ThemeContext);
    
    const router = useRouter();
    const insets = useSafeAreaInsets(); 
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background, 
            paddingBottom: 10,
            paddingHorizontal: 15,
            borderBottomWidth: 1, 
            borderBottomColor: theme.border,
        },
        backButton: {
            padding: 2, 
        },
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            
                <Ionicons name="arrow-back" size={28} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
};

export default HeaderS;