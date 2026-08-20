import { styles } from '@/assets/styles/auth.styles';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router'; // Kan7ydo useRouter, mab9inax n7tajoh hna
import { useState, useContext } from 'react'; // ==> 2. KANZIDO useContext
import {  ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown, FadeInRight, FadeInUp } from "react-native-reanimated";
import { COLORS } from "@/constants/colors";
import { AuthContext } from '@/context/AuthContext'; // ==> 3. KANJIBO SNDO9 (AuthContext) DYALNA

export default function Page() {
 
  
  // ==> 5. KANJBDO LA FONCTION "signIn" MEN SNDO9 DYALNA
  const { signIn } = useContext(AuthContext); 

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // ==> 6. KANBEDDLO L "MOTEUR" DYAL L CONNEXION KAMEL
  const onSignInPress = async () => {
    // Kanms7o l'erreur l9dima 9bel manbdaw
    setError(''); 

    try {
      // Kan3iyto l la fonction signIn dyalna (li f AuthContext)
      await signIn(emailAddress, password);
      
      // Safi! Makayn la router.replace() la walo.
      // _layout.jsx ghaychof l changement o ydkhel l'user.

    } catch (err) {
      // Ila jat chi erreur men l backend (mot de passe ghalet, etc.)
      // L backend dyalk khasso yrjje3 message dyal l'erreur
      const errorMessage = err.response?.data?.message || "Email or password incorrect.";
      setError(errorMessage);
      console.error("Login Error:", err.response?.data || err.message);
    }
  };

  // L CODE L TE7TANI KAMEL KAYB9A KIMA HOWA, MATQIS F WAAAALO
  return (
    <ImageBackground source={require('@/assets/images/Background(PNG).png')} style={{ flex: 1 }} contentFit="cover" >
      <LinearGradient colors={["transparent", 'rgba(245, 230, 223, 0.9)', 'rgba(245, 230, 223, 1)']} style={stylees.background}>
        <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} enableAutomaticScroll={true} extraScrolHeight={30}>
          <View style={stylees.transpaBackground}>
            <View style={stylees.warapper}>
              <Animated.View entering={FadeInDown.delay(200).duration(300).springify()}>
                <Image source={require('@/assets/images/logonestify.png')} style={stylees.imgbackground} />
                <Animated.View style={stylees.divider} entering={FadeInDown.delay(250).duration(300).springify()} />
              </Animated.View>

              <Animated.Text style={styles.title} entering={FadeInUp.delay(300).duration(300).springify()}>Welcome Back</Animated.Text>

              {error ? (
                <Animated.View entering={FadeInRight.delay(300).duration(300).springify()}>
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => setError("")}>
                      <Ionicons name="close" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ) : null}

              <Animated.View entering={FadeInDown.delay(400).duration(200).springify()}>
                <TextInput
                  style={[styles.input, error && styles.errorInput]}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholderTextColor="#9A8478"
                  placeholder="Enter email"
                  keyboardType='email-address'
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
                <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                  <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(1000).duration(300).springify()}>
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText} >Don&apos;t have an account ?</Text>
                  <Link href="/sign-up" asChild>
                    <TouchableOpacity>
                      <Text style={styles.linkText} >Sign up</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </Animated.View>
              <View>
                <Animated.View style={styles.divider} entering={FadeInDown.delay(1200).duration(300).springify()} />

                {/* Mola7ada: SocialLoginButtons ghadi khsso t9addo b tariqa okhra (b7al Expo AuthSession). Daba nkhliwh haka */}
                <SocialLoginButtons emailHref={'/'} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </ImageBackground>
  )
}

const stylees = StyleSheet.create({
  transpaBackground: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 20,
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center'
  },
  warapper: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: "stretch"
  },
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