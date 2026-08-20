import { Slot, useRouter } from 'expo-router'; // ==> 1. KANZIDO useRouter
import { useContext, useEffect } from 'react'; // ==> 2. KANZIDO useEffect
import { ActivityIndicator, View } from 'react-native';

import SafeScreen from  "@/components/SafeScreen";
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, isLoading } = useContext(AuthContext);
    const router = useRouter(); // ==> 3. KAN3RFO L ROUTER

    // ==> 4. KANSTA3MLO useEffect BACH YB9A MRA9EB L HALA
    useEffect(() => {
        // Matdir walo tantssaliw l loading
        if (isLoading) {
            return; 
        }

        // Mli yssali l loading, o nلقاو l'user MAKAYNCH
        if (!user) {
            // Sifto l sign-in
            router.replace('/sign-in');
        }
    }, [isLoading, user, router]); // Had l code ghay3awd ykhdem ay mra 'isLoading' wla 'user' tbeddel

    // Ila konna ba9in kanloadiw, n'affichiw spinner
    if (isLoading) {
        return (
            <SafeScreen>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </SafeScreen>
        );
    }
    
    // Dima n'affichiw l'application. L useEffect howa li ghaykoun mkellet b redirection
    return (
        <SafeScreen>
            <Slot />
        </SafeScreen>
    );
}

export default function RootLayout() {
  return (
     <ThemeProvider>
        <AuthProvider>
            <Layout />
        </AuthProvider>
     </ThemeProvider>
  );
}