// 1. تعديل الـ Imports
import React, { useState, useRef, useEffect, useContext } from 'react'; // زدنا useContext
import {
  View, Text, SafeAreaView, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import HeaderS from '@/components/HeaderSimple';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/context/ThemeContext'; // جبنا الكونتكست
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/config';
const AUTH_API_URL = `${API_URL}/auth`;


const VerificationScreen = () => {
  // 2. استعمال useContext باش نجيبو الثيم الحالي
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  // ... باقي الحالات واللوجيك ديالك (useState, useEffect, etc.) ...
  const [verificationStep, setVerificationStep] = useState('GET_CODE');
  const [code, setCode] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (verificationStep !== 'ENTER_CODE' || canResend) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [verificationStep, canResend]);

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${AUTH_API_URL}/send-verification`);
      setVerificationStep('ENTER_CODE');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send verification code.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post(`${AUTH_API_URL}/verify-code`, { code: enteredCode });
      setVerificationStep('VERIFIED');
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendCode = async () => {
    if (!canResend) return;
    setCode(new Array(6).fill(''));
    setCanResend(false);
    setCountdown(60);
    setError('');
    // N3awdo nṣifṭo l'code b nafs l'khadma dyal handleSendCode
    await handleSendCode();
  };
  const handleTextChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // 4. دخلنا الستايلات لداخل باش تقدر تستخدم المتغير 'theme'
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 30,
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
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 15,
      textAlign: 'center',
    },
    description: {
      fontSize: 16,
      color: theme.textLight,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 30,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    otpInput: {
      width: 45,
      height: 55,
      borderWidth: 2,
      borderColor: theme.primary,
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
      backgroundColor: theme.background, // استعملنا خلفية الثيم
    },
    ctaButton: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      borderRadius: 30,
      width: '100%',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
      marginBottom: 20,
    },
    ctaButtonText: {
      color: theme.white,
      fontSize: 18,
      fontWeight: 'bold',
    },
    resendText: {
      fontSize: 15,
      fontWeight: '600',
    },
    errorText: {
      color: theme.expense, // استعملنا لون المصاريف كلون للخطأ
      fontSize: 14,
      marginBottom: 15,
    },
  });

  if (user && user.is_verified) {
    // Ila kan l'user déja m'vérifié, kan'renderiw had l'écran l'khass
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderS />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: theme.income + '20' }]}>
              <MaterialCommunityIcons name="shield-check" size={50} color={theme.income} />
            </View>
            <Text style={styles.title}>Account Already Verified</Text>
            <Text style={styles.description}>
              Your email address ({user.email}) has already been successfully verified.
            </Text>
            {/* Kan'zidou bouton bach y'rje3 l'lor */}
            <TouchableOpacity style={styles.ctaButton} onPress={() => router.back()}>
              <Text style={styles.ctaButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const renderContentByStep = () => {
    switch (verificationStep) {
      case 'ENTER_CODE':
        return (
          <View style={styles.card}>
            <Text style={styles.title}>Enter Code</Text>
            <Text style={styles.description}>
              We have sent a 6-digit code to {user?.email}. Please enter it below.
            </Text>
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={el => inputs.current[index] = el}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(text) => handleTextChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  value={digit}
                />
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.ctaButton} onPress={handleVerifyCode} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color={theme.white} /> : <Text style={styles.ctaButtonText}>Verify</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
              <Text style={[styles.resendText, { color: canResend ? theme.primary : theme.textLight }]}>
                {canResend ? "Didn't get the code? Resend" : `Resend code in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 'VERIFIED':
        return (
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: theme.income + '20' }]}>
              <MaterialCommunityIcons name="shield-check" size={50} color={theme.income} />
            </View>
            <Text style={styles.title}>Email Verified!</Text>
            <Text style={styles.description}>Congratulations! Your email has been successfully verified. Your account is now more secure.</Text>
          </View>
        );

      default: // 'GET_CODE'
        return (
          <View style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="mail" size={50} color={theme.primary} />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.description}>To ensure the security of your account, please verify your email address. We will send a verification code to you.</Text>
            <TouchableOpacity style={styles.ctaButton} onPress={handleSendCode}>
              <Text style={styles.ctaButtonText}>Send Verification Code</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderS />
      <ScrollView contentContainerStyle={styles.container}>
        {renderContentByStep()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationScreen;