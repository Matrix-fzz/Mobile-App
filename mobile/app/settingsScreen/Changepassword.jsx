import React, { useContext, useState } from 'react';
import {
  Alert, SafeAreaView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

// ==> 1. IMPORTI L'CONTEXT DYALEK HNA <==
import { AuthContext } from '@/context/AuthContext'; // T2ekked men l'path
import { ThemeContext } from '@/context/ThemeContext';
import { API_URL } from '@/config';
import HeaderS from '@/components/HeaderSimple';

const ChangePassword = () => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // ==> 3. ZID HAD LES STATES L GESTION DYAL LOADING O ERRORS
  const [loading, setLoading] = useState(false);

  // Function dyal changement de mot de passe (MODIFIÉE)
  const handleChangePassword = async () => { // <== Rddinaha async
    // L'validation l'awwaliya katb9a hiya hiya
    if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'The new passwords do not match.');
            return;
        }
  // T'akked anaho l'user m'connecté 9bel ma dir ayi 7aja
        if (!user) {
            Alert.alert('Error', 'You need to be logged in to change your password.');
            return;
        }
    // N'bda l'loading
    setLoading(true);

  try {
            // L'APPEL DABA WELA BSSIIT BZAF!
            // Ma kan7tajoch n specifyiw l'headers 7it l'AuthContext déja dar l'khadma
            const response = await axios.post(
                `${API_URL}/users/change-password`, 
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }
            );

            Alert.alert('Success', response.data.message || 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            Alert.alert('Error', errorMessage);
            console.error("Failed to change password:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


  const styles = StyleSheet.create({
    // ... Nfs les styles dyalek ...
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flex: 1, padding: 24, paddingTop: 60 },
    title: { fontSize: 28, fontWeight: 'bold', color: theme.text, textAlign: 'center', marginBottom: 32 },
    inputContainer: { marginBottom: 16 },
    label: { fontSize: 16, color: theme.text, marginBottom: 8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 10, borderWidth: 1, borderColor: theme.border },
    input: { flex: 1, color: theme.text, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16 },
    iconContainer: { padding: 12 },
    button: { backgroundColor: theme.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24, shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
    buttonText: { color: theme.buttonText, fontSize: 18, fontWeight: '600' },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HeaderS />
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>
        
        {/* ... L'JSX dyal les inputs makaytbeddelch ... */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={theme.textLight} secureTextEntry={!showCurrentPassword} value={currentPassword} onChangeText={setCurrentPassword} /><TouchableOpacity style={styles.iconContainer} onPress={() => setShowCurrentPassword(!showCurrentPassword)}><Feather name={showCurrentPassword ? 'eye-off' : 'eye'} size={22} color={theme.textLight} /></TouchableOpacity></View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={theme.textLight} secureTextEntry={!showNewPassword} value={newPassword} onChangeText={setNewPassword} /><TouchableOpacity style={styles.iconContainer} onPress={() => setShowNewPassword(!showNewPassword)}><Feather name={showNewPassword ? 'eye-off' : 'eye'} size={22} color={theme.textLight} /></TouchableOpacity></View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputWrapper}><TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={theme.textLight} secureTextEntry={!showConfirmPassword} value={confirmPassword} onChangeText={setConfirmPassword} /><TouchableOpacity style={styles.iconContainer} onPress={() => setShowConfirmPassword(!showConfirmPassword)}><Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color={theme.textLight} /></TouchableOpacity></View>
        </View>

        {/* ==> 7. KAN'MODIFIW L'BUTTON BACH Y'BAYYEN L'LOADING */}
        <TouchableOpacity 
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]} // Kan9lilo l'opacity mli ykoun loading
          onPress={handleChangePassword}
          disabled={loading} // Kan'disactiviw l'button bach l'user mayb9ach y'cliki
        >
          {loading ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;