import { useState, useContext } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from "@/assets/styles/auth.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { Image } from "expo-image";
import { Link } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
export default function SignUpScreen() {
  const { signUp } = useContext(AuthContext);
  const [name, setName] = useState(''); // ==> 4. KANZIDO STATE JDID DYAL L'NAME
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const onSignUpPress = async () => {
    setError(''); 

    if (!name || !emailAddress || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
  
      await signUp({
        name: name,
        email: emailAddress,
        password: password,
      });

  

    } catch (err) {
      const errorMessage = err.response?.data?.message || "This email is already taken.";
      setError(errorMessage);
      console.error("Sign Up Error:", err.response?.data || err.message);
    }
  };
 
  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} enableAutomaticScroll={true} extraScrolHeight={30}>
      <View style={styles.container}>
        <Animated.View entering={FadeInDown.delay(200).duration(300).springify()}>
          <Image source={require('@/assets/images/logonestify.png')} style={stylees.imgbackground} />
          <Animated.View style={stylees.divider} entering={FadeInDown.delay(250).duration(300).springify()} />
        </Animated.View>
        <Animated.Text style={styles.title} entering={FadeInUp.delay(300).duration(300).springify()}>Create Account</Animated.Text>
        code
        Code
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error} </Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ==> 7. KANZIDO L INPUT DYAL L'NAME */}
        <Animated.View entering={FadeInDown.delay(400).duration(200).springify()}>
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="words"
            value={name}
            placeholderTextColor="#9A8478"
            placeholder="Enter your name"
            onChangeText={(name) => setName(name)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(200).springify()}>
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            autoCapitalize="none"
            value={emailAddress}
            placeholderTextColor="#9A8478"
            placeholder="Enter email"
            keyboardType="email-address"
            onChangeText={(email) => setEmailAddress(email)}
          />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(600).duration(300).springify()}>
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#9A8478"
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={COLORS.textLight}
            />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(800).duration(300).springify()}>
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(1000).duration(300).springify()}>
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
        <View>
          <Animated.View style={styles.divider} entering={FadeInDown.delay(1200).duration(300).springify()} />
          <SocialLoginButtons emailHref={'/sign-in'} />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}
const stylees = StyleSheet.create({
  imgbackground: {
    contentFit: 'center',
    width: 200,
    height: 180,
    alignSelf: "center",
    margin: 10,
    filter: "drop-shadow (1px 1px 20px black)",
  },
  divider: {
    borderBottomColor: COLORS.primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: '50%',
    backgroundColor: COLORS.primary,
    height: 5,
    borderRadius: "100%",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    zIndex: -1
  }
})