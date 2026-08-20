import { Stack, useRouter } from 'expo-router'; // ==> 1. KANZIDO useRouter
import { useContext, useEffect } from 'react'; // ==> 2. KANZIDO useEffect
import { AuthContext } from '@/context/AuthContext';

export default function AuthRoutesLayout() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // ==> 3. NEFS L PRINCIPE, KANDIRO REDIRECTION B useEffect
  useEffect(() => {
    // Ila l'utilisateur déja mconnecté (b ghalat dkhel l sign-in)
    if (user) {
      // Sifto l l'accueil
      router.replace('/');
    }
  }, [user, router]);

  // Dima n'returniw l layout dyal les pages (sign-in, sign-up)
  return <Stack screenOptions={{headerShown: false}} />;
}