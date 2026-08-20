import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from 'expo-router';
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from '@/context/ThemeContext';
import Zocial from '@expo/vector-icons/Zocial';

const SocialLoginButtons = ({ emailHref }) => {
    const { theme } = useContext(ThemeContext);
    
    const styles = StyleSheet.create({
        socialLoginWrapper: {
            alignSelf: "stretch",
        },
        button: {
            flexDirection: "row",
            borderColor: theme.primary,
            backgroundColor: theme.card,
            borderWidth: 1.5,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 15,
            marginBottom: 15,
            gap: 10,
        },
        btnTxt: {
            fontSize: 16,
            fontWeight: "600",
            color: theme.text,
        },
        icons: {
            color: theme.primary,
            fontSize: 22,
        },
    });

    return (
        <View style={styles.socialLoginWrapper}>
            <Animated.View entering={FadeInDown.delay(1600).duration(300).springify()}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons name="logo-google" style={styles.icons} />
                    <Text style={styles.btnTxt}>Continue with Google</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1800).duration(300).springify()}>
                <TouchableOpacity style={styles.button}>
                    <Ionicons style={styles.icons} name="logo-facebook" />
                    <Text style={styles.btnTxt}>Continue with Facebook</Text>
                </TouchableOpacity>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(2000).duration(300).springify()}>
                <Link href={emailHref} asChild>
                    <TouchableOpacity style={styles.button}>
                        
                        <Zocial name="guest" style={styles.icons} />
                        <Text style={styles.btnTxt}>Continue as Guest</Text>
                    </TouchableOpacity>
                </Link>
            </Animated.View>
        </View>
    );
};

export default SocialLoginButtons;