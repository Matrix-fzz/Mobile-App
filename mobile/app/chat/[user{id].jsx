// 1. تعديل الـ Imports
import React, { useState, useEffect, useContext } from 'react'; // زدنا useContext
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '@/context/ThemeContext'; 


export default function ChatScreen() {
    const { theme } = useContext(ThemeContext);
    
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    const [messages, ] = useState([
        // بيانات وهمية للتجربة  setMessages
        { id: 1, text: 'Hello!', senderId: 'other' },
        { id: 2, text: 'Hi, how are you?', senderId: 'me' },
    ]);
    const [input, setInput] = useState("");

     useEffect(() => { /* ... */ }, [userId]);
    const sendMessage = async () => { /* ... */ };

   
    const styles = StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.background, // <--- تبدل اللون
        },
        container: { 
            flex: 1, 
            padding: 10 
        },
        messageBubble: {
            paddingVertical: 10,
            paddingHorizontal: 15, // زدت padding
            borderRadius: 20, // زدت radius باش يجي الشكل أحسن
            marginVertical: 5,
            maxWidth: "70%",
        },
        myMessage: { 
            backgroundColor: theme.primary, // <--- تبدل اللون
            alignSelf: "flex-end",
            borderBottomRightRadius: 5, // باش يجي الشكل ديال فقاعة
        },
        theirMessage: { 
            backgroundColor: theme.card, // <--- تبدل اللون
            alignSelf: "flex-start",
            borderBottomLeftRadius: 5,
            borderWidth: 1,
            borderColor: theme.border,
        },
        myMessageText: { // نص خاص بالرسائل ديالي
            color: theme.white,
        },
        theirMessageText: { // نص خاص بالرسائل ديال الآخر
            color: theme.text,
        },
        inputRow: {
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderTopWidth: 1,
            borderColor: theme.border, // <--- تبدل اللون
            backgroundColor: theme.background, // باش ما يبانش شفاف
        },
        input: {
            flex: 1,
            backgroundColor: theme.card, // <--- تبدل اللون
            padding: 10,
            borderRadius: 20,
            marginRight: 10,
            borderWidth: 1,
            borderColor: theme.border, // <--- تبدل اللون
            color: theme.text, // لون النص اللي كيتكتب
        },
        sendButton: {
            backgroundColor: theme.primary, // <--- تبدل اللون
            padding: 10, // درت padding باش يجي مربع
            borderRadius: 50, // باش يجي دائري
            justifyContent: 'center',
            alignItems: 'center',
        },
        header: {
            paddingVertical: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.background, // <--- تبدل اللون
            borderBottomWidth: 1,
            borderBottomColor: theme.border, // <--- تبدل اللون
        },
        backButton: {
            backgroundColor: theme.card, // <--- تبدل اللون
            borderRadius: 20,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                {/* يمكنك تزيد اسم المستخدم هنا */}
                {/* <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginLeft: 15 }}>{userName}</Text> */}
            </View>

            <View style={styles.container}>
                <FlatList
                    data={messages}
                    inverted // باش الميساجات يبداو من التحت
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageBubble,
                                item.senderId === "me" ? styles.myMessage : styles.theirMessage,
                            ]}
                        >
                            <Text style={item.senderId === "me" ? styles.myMessageText : styles.theirMessageText}>
                                {item.text}
                            </Text>
                        </View>
                    )}
                />

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={theme.textLight}
                        placeholder="Type a message..."
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Ionicons name="send" size={20} color={theme.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}