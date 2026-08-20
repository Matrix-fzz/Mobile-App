import React, {useState, useEffect, useContext, useCallback } from 'react'; 
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import HeaderS from '@/components/HeaderSimple';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { ThemeContext } from '@/context/ThemeContext'; 
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/config';

const AUTH_API_URL = `${API_URL}/auth`;

const AuthenticatorScreen = () => {
    const { user, refetchUser } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    const [authStatus, setAuthStatus] = useState('LOADING');
    const [secret, setSecret] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [isDisabling, setIsDisabling] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [disableError, setDisableError] = useState('');

    // Had l useEffect howa l wa7id li mkellet ybeddel l'affichage
    useEffect(() => {
        if (user) {
            setAuthStatus(user.two_factor_enabled ? 'ENABLED' : 'DISABLED');
        } else {
            setAuthStatus('LOADING');
        }
    }, [user]);

    const fetchRecoveryCodes = useCallback(async () => {
        if (!user || !user.two_factor_enabled) return;
        try {
            const { data } = await axios.get(`${AUTH_API_URL}/2fa/recovery-codes`);
            setRecoveryCodes(data.recoveryCodes || []);
        } catch (_error) {
            console.error("Could not fetch recovery codes");
        }
    }, [user]);

    useEffect(() => {
        if (authStatus === 'ENABLED') {
            fetchRecoveryCodes();
        }
    }, [authStatus, fetchRecoveryCodes]);
    
    const handleEnable = async () => {
        try {
            const { data } = await axios.post(`${AUTH_API_URL}/2fa/generate`);
            setSecret(data.secret);
            setQrCodeUrl(data.qrCodeUrl);
            setAuthStatus('SETUP');
        } catch (error) {
            Alert.alert(error, 'Could not start 2FA setup.');
        }
    };

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied!', 'The key has been copied to your clipboard.');
    };

     const handleVerifyAndEnable = async () => {
        try {
            await axios.post(`${AUTH_API_URL}/2fa/verify`, { token: verificationCode });
            
            // 7yyedna setAuthStatus('ENABLED')
            
            // Daba kan tssennaw refetchUser 7ta yssali
            if (refetchUser) {
                await refetchUser(); 
            }
            // Mli ghay ssali, l'objet "user" jdid ghadi yji, o l'useEffect lfo9ani ghaykhdem
            
        } catch (_error) {
            Alert.alert('Error', 'The verification code is incorrect. Please try again.');
        }
    };
    
   const handleDisable = async () => {
        if (!passwordInput) {
            setDisableError("Password is required.");
            return;
        }
        setDisableError('');
        try {
            await axios.post(`${AUTH_API_URL}/2fa/disable`, { password: passwordInput });
            setAuthStatus('DISABLED');
            setIsDisabling(false);
            setPasswordInput('');
            if (refetchUser) await refetchUser();
            Alert.alert('Success', 'Two-Factor Authentication has been disabled.');
        } catch(error) {
            const errorMessage = error.response?.data?.message || 'Could not disable 2FA.';
            setDisableError(errorMessage);
        }
    };
  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    card: {
      alignItems: 'center',
      backgroundColor: theme.card, 
      borderRadius: 20, 
      padding: 25,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 15, textAlign: 'center' },
    description: { fontSize: 16, color: theme.textLight, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
    ctaButton: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      borderRadius: 30,
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
    },
    ctaButtonText: { color: theme.white, fontSize: 18, fontWeight: 'bold' },
    step: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', marginBottom: 10, marginTop: 20 },
    stepNumber: {
      backgroundColor: theme.primary,
      color: theme.white,
      width: 24,
      height: 24,
      borderRadius: 12,
      textAlign: 'center',
      fontWeight: 'bold',
      marginRight: 10,
      lineHeight: 24,
    },
    stepText: { fontSize: 15, color: theme.text, flex: 1, lineHeight: 22 },
    qrContainer: { padding: 10, backgroundColor: theme.white, borderRadius: 10, marginBottom: 15 },
    secretKeyContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.white,
      padding: 15,
      borderRadius: 10,
      width: '100%',
      borderWidth: 1,
      borderColor: theme.border,
    },
    secretKeyText: { fontSize: 16, fontWeight: 'bold', color: theme.primary, letterSpacing: 1 },
    codeInput: {
      width: '100%',
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 22,
      padding: 12,
      marginTop: 10,
      marginBottom: 20,
      fontWeight: 'bold',
      letterSpacing: 10,
      backgroundColor: theme.white,
      color: theme.text, // مهم باش النص اللي كيتكتب يبان
    },
    recoveryTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 10 },
    recoveryCodesContainer: {
      width: '100%',
      backgroundColor: theme.white,
      borderRadius: 10,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border, // استعملنا border ديال الثيم
    },
    recoveryCode: { fontSize: 16, fontWeight: 'bold', color: theme.text, letterSpacing: 2, marginVertical: 5 },
  });

  const renderContent = () => {
        if (authStatus === 'LOADING') {
            return <ActivityIndicator style={{marginTop: 50}} size="large" color={theme.primary} />;
        }

        switch (authStatus) {
            case 'SETUP':
                return (
                    <View style={styles.card}>
                        <Text style={styles.title}>Set Up Authenticator</Text>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>1</Text>
                            <Text style={styles.stepText}>Scan this QR code with your authenticator app.</Text>
                        </View>
                        <View style={styles.qrContainer}>
                            {qrCodeUrl ? <QRCode value={qrCodeUrl} size={180} /> : <ActivityIndicator />}
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>2</Text>
                            <Text style={styles.stepText}>Or, enter this secret key manually.</Text>
                        </View>
                        <TouchableOpacity style={styles.secretKeyContainer} onPress={() => copyToClipboard(secret)}>
                            <Text style={styles.secretKeyText}>{secret}</Text>
                            <Feather name="copy" size={20} color={theme.primary} />
                        </TouchableOpacity>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>3</Text>
                            <Text style={styles.stepText}>Enter the 6-digit code from your app.</Text>
                        </View>
                        <TextInput style={styles.codeInput} keyboardType="numeric" maxLength={6} value={verificationCode} onChangeText={setVerificationCode} />
                        <TouchableOpacity style={styles.ctaButton} onPress={handleVerifyAndEnable}>
                            <Text style={styles.ctaButtonText}>Verify & Enable</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 'ENABLED':
                return (
                    <View style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.income + '20' }]}>
                            <MaterialCommunityIcons name="shield-check" size={50} color={theme.income} />
                        </View>
                        <Text style={styles.title}>Authenticator Enabled</Text>
                        <Text style={styles.description}>Your account is protected with 2FA.</Text>
                        
                        {recoveryCodes.length > 0 && (
                            <>
                                <Text style={styles.recoveryTitle}>Recovery Codes</Text>
                                <Text style={styles.description}>Save these codes. They can be used if you lose access to your device.</Text>
                                <View style={styles.recoveryCodesContainer}>
                                    {recoveryCodes.map(code => <Text key={code} style={styles.recoveryCode}>{code}</Text>)}
                                </View>
                            </>
                        )}
                        
                        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.expense, marginTop: 30 }]} onPress={() => setIsDisabling(!isDisabling)}>
                            <Text style={styles.ctaButtonText}>Disable Authenticator</Text>
                        </TouchableOpacity>

                        {isDisabling && (
                            <View style={{width: '100%', marginTop: 20}}>
                                <Text style={styles.description}>To disable 2FA, please enter your current password to confirm.</Text>
                                <TextInput
                                    style={styles.codeInput}
                                    placeholder="Password"
                                    secureTextEntry
                                    value={passwordInput}
                                    onChangeText={setPasswordInput}
                                />
                                {disableError ? <Text style={{color: theme.expense, textAlign: 'center', marginBottom: 10}}>{disableError}</Text> : null}
                                <TouchableOpacity style={styles.ctaButton} onPress={handleDisable}>
                                    <Text style={styles.ctaButtonText}>Confirm & Disable</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                );
            default: // 'DISABLED'
                return (
                    <View style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                            <MaterialCommunityIcons name="shield-lock-outline" size={50} color={theme.primary} />
                        </View>
                        <Text style={styles.title}>Add Extra Security</Text>
                        <Text style={styles.description}>Protect your account by enabling Two-Factor Authentication (2FA).</Text>
                        <TouchableOpacity style={styles.ctaButton} onPress={handleEnable}>
                            <Text style={styles.ctaButtonText}>Enable Authenticator</Text>
                        </TouchableOpacity>
                    </View>
                );
        }
    };

    return (
           <SafeAreaView style={styles.safeArea}>
        <HeaderS />
        <ScrollView contentContainerStyle={styles.container}>
            {renderContent()}
        </ScrollView>
    </SafeAreaView>

    );
};

export default AuthenticatorScreen;