// 1. تعديل الـ Imports
import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
// import usePropertyDetails from "@/hooks/usePropertyDetails"; // ==> 1. KAN7YDO L IMPORT DYAL L HOOK
import { ThemeContext } from '@/context/ThemeContext';

// Helper function كتبقى كيفما هي
const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Never";
    const now = new Date();
    const seen = new Date(lastSeen);
    const diff = Math.floor((now - seen) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
    return `${Math.floor(diff / 86400)} days ago`;
};

const AgentProfileCard = ({ owner  }) => {
    const { theme } = useContext(ThemeContext);
   // const { user } = usePropertyDetails(property_id);
    const router = useRouter();

    // ==== ZEDNA FUNCTION JDIDA ====
    // Hadi hiya l function li ghadi t'executa mli nclikiw 3la l'icone dyal telephone
    const handleMakeCall = () => {
        const phoneNumber = '+212528262730';
        const url = `tel:${phoneNumber}`;

        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert("Error", `Don't know how to open this URL: ${url}`);
                }
            })
            .catch(err => console.error('An error occurred', err));
    };

 if (!owner) {
        return (
            <View style={styles.infoSection}>
                <Text style={styles.name}>Owner information not available.</Text>
            </View>
        );
    }

    const roleColors = {
        admin: theme.primary,
        agent: theme.textLight,
        owner: theme.income,
        client: theme.gold || '#fdd835',
        default: theme.gray,
    };

    const styles = StyleSheet.create({
        infoSection: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.card,
            padding: 0,
            borderRadius: 12,
            marginTop: 0,
        },
        avatarWrapper: {
            position: "relative",
            width: 70,
            height: 70,
            marginRight: 15,
        },
        avatar: {
            width: 70,
            height: 70,
            borderRadius: 35,
            borderWidth: 3,
        },
        statusDot: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 3,
            borderColor: theme.card,
            position: "absolute",
            bottom: 5,
            right: -2,
        },
        details: { flex: 1 },
        nameRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        name: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.text,
            marginBottom: 2,
        },
        roleBadge: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 50,
            marginTop: 5,
            alignSelf: "flex-start",
        },
        roleText: {
            color: theme.white,
            fontSize: 9,
            fontWeight: "bold",
        },
        verifiedBadge: {
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
        },
        lastSeen: {
            color: theme.textLight,
            fontSize: 12,
            marginTop: 5,
        },
        // ==== CONTAINER JDID DYAL LES BOUTONS ====
        actionsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        // ==== STYLE MOCHTARAK L LES BOUTONS ====
        iconButton: {
            backgroundColor: theme.primary,
            borderRadius: 50,
            width: 40, // زدنا width o height باش يكونو بحال بحال
            height: 40,
            justifyContent: 'center', // باش تجي الأيقونة فالوسط
            alignItems: 'center', // باش تجي الأيقونة فالوسط
            marginLeft: 8, // مسافة بين الأيقونات
          
        },
    });

    return (
        <View style={styles.infoSection}>
            <View style={styles.avatarWrapper}>
                <Image
                    source={
                        owner.profile_photo
                            ? { uri: owner.profile_photo }
                            : require("@/assets/images/default.jpg")
                    }
                    style={[
                        styles.avatar,
                        { borderColor: owner.status === "online" ? theme.income : theme.expense },
                    ]}
                />
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: owner.status === "online" ? theme.income : theme.expense },
                    ]}
                />
            </View>

            <View style={styles.details}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{owner.name}</Text>
                    {owner.is_verified && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="check-circle" size={20} color={theme.income} />
                        </View>
                    )}
                </View>

                <View
                    style={[
                        styles.roleBadge,
                        { backgroundColor: roleColors[owner.role] || roleColors.default },
                    ]}
                >
                    <Text style={styles.roleText}>{owner.role?.toUpperCase()}</Text>
                </View>

                {owner.status === "offline" && (
                    <Text style={styles.lastSeen}>
                        Last seen: {formatLastSeen(owner.last_seen)}
                    </Text>
                )}
            </View>
            <View style={styles.actionsContainer}>
                {/* L Bouton Jdid Dyal l'appel */}
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleMakeCall} // Kan3eyto l function jdida
                >
                
                    <Icon name="phone" size={20} color={theme.white} />
                </TouchableOpacity>

                {/* L Bouton L9dim Dyal l message */}
                <TouchableOpacity
                    style={styles.iconButton} // 3tinah nefs style
                    onPress={() => router.push(`/chat/${owner.user_id}`)}
                >
                    <AntDesign name="message1" size={20} color={theme.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AgentProfileCard;